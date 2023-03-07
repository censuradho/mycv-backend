import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/database/prisma.service'
import { ForbiddenException } from 'src/decorators/errors'
import { PaginationDto } from 'src/dto/pagination.dto'
import { slugify } from 'src/utils/slugfy'
import { AuthRequest } from '../auth/models'
import { AvatarService } from '../avatar/avatar.service'
import { CreateCurriculumDto } from './dto/create'
import { QueryDto } from './dto/query'
import { UpdateCurriculumDto } from './dto/update'
import { CURRICULUM_ERRORS } from './errors'

@Injectable()
export class CurriculumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly avatar: AvatarService,
    @Inject(REQUEST) private readonly request: AuthRequest
  ) {}

  async create(payload: CreateCurriculumDto) {
    const curriculumExist = await this.prisma.curriculum.findUnique({
      where: {
        user_id: this.request.user.id,
      },
    })

    if (curriculumExist)
      throw new ForbiddenException(
        CURRICULUM_ERRORS.USER_ALREADY_RELATED_CURRICULUM
      )

    const {
      address,
      portfolios = [],
      educations = [],
      experiences = [],
      links = [],
      skills = [],
      languages = [],
    } = payload

    return await this.prisma.curriculum.create({
      data: {
        id: randomUUID(),
        civil_state: payload?.civil_state,
        contact_preference: payload?.contact_preference,
        phone: payload?.phone,
        presentation: payload?.presentation,
        public_email: payload?.public_email,
        is_pcd: payload?.is_pcd,
        searchable: payload?.searchable,
        title: payload.title,
        first_name: payload.first_name,
        last_name: payload.last_name,
        slug: slugify(`${payload.first_name} ${payload.last_name}`.trim()),
        ...(address && {
          address: {
            create: {
              id: randomUUID(),
              city: address.city,
              country: address.country,
            },
          },
        }),
        ...(portfolios && {
          portfolios: {
            create: portfolios?.map((value) => ({
              id: randomUUID(),
              icon: value?.icon,
              link: value?.link,
              name: value?.name,
            })),
          },
        }),
        ...(skills && {
          skills: {
            create: skills?.map((value) => ({
              id: randomUUID(),
              name: value.name,
            })),
          },
        }),
        ...(languages && {
          languages: {
            create: languages?.map((value) => ({
              id: randomUUID(),
              conversation: value.conversation,
              name: value.name,
              reading: value.reading,
              writing: value.writing,
            })),
          },
        }),
        ...(educations && {
          educations: {
            create: educations?.map((value) => ({
              id: randomUUID(),
              initial_date: value?.initial_date,
              final_date: value?.final_date,
              situation: value?.situation,
              level: value?.level,
              institution_name: value?.institution_name,
              is_main: value?.is_main,
              title: value?.title,
              description: value?.description,
            })),
          },
        }),
        ...(links && {
          links: {
            create: links?.map((value) => ({
              id: randomUUID(),
              href: value.href,
              icon: value.icon,
              name: value.name,
              description: value.description,
            })),
          },
        }),
        ...(experiences && {
          experiences: {
            create: experiences?.map((value) => ({
              id: randomUUID(),
              description: value?.description,
              is_main: value?.is_main,
              initial_date: value?.initial_date,
              final_date: value?.final_date,
              employer: value?.employer,
              title: value?.title,
            })),
          },
        }),
        user: {
          connect: {
            id: this.request.user.id,
          },
        },
      },
    })
  }

  async update(payload: UpdateCurriculumDto) {
    const {
      id,
      address,
      portfolios = [],
      educations = [],
      experiences = [],
      links = [],
      skills = [],
      languages = [],
      linksToDelete,
      skillsToDelete,
      educationsToDelete,
      experiencesToDelete,
      languagesToDelete,
      portfoliosToDelete,
    } = payload

    await this.prisma.curriculum.update({
      where: {
        id,
      },
      data: {
        ...(educationsToDelete && {
          educations: {
            deleteMany: {
              AND: educationsToDelete.map((value) => ({ id: value })),
            },
          },
        }),
        ...(portfoliosToDelete && {
          portfolios: {
            deleteMany: {
              AND: portfoliosToDelete.map((value) => ({ id: value })),
            },
          },
        }),
        ...(languagesToDelete && {
          languages: {
            deleteMany: {
              AND: languagesToDelete.map((value) => ({ id: value })),
            },
          },
        }),
        ...(linksToDelete && {
          links: {
            deleteMany: {
              AND: linksToDelete.map((value) => ({ id: value })),
            },
          },
        }),
        ...(experiencesToDelete && {
          experiences: {
            deleteMany: {
              AND: experiencesToDelete.map((value) => ({ id: value })),
            },
          },
        }),
        ...(skillsToDelete && {
          skills: {
            deleteMany: {
              AND: skillsToDelete.map((value) => ({ id: value })),
            },
          },
        }),
      },
    })

    await this.prisma.$transaction([
      this.prisma.curriculum.update({
        where: {
          id,
        },
        data: {
          civil_state: payload?.civil_state,
          contact_preference: payload?.contact_preference,
          phone: payload?.phone,
          presentation: payload?.presentation,
          public_email: payload?.public_email,
          is_pcd: payload?.is_pcd,
          searchable: payload?.searchable,
          title: payload.title,
          first_name: payload.first_name,
          last_name: payload.last_name,
          ...(address && {
            address: {
              update: {
                city: address.city,
                country: address.country,
                updated_at: new Date(),
              },
            },
          }),
        },
      }),
      ...portfolios.map((value) =>
        this.prisma.portfolio.upsert({
          where: {
            id: value?.id || '',
          },
          update: {
            description: value?.description,
            icon: value?.icon,
            link: value?.link,
            name: value?.name,
            updated_at: new Date(),
          },
          create: {
            id: randomUUID(),
            description: value?.description,
            icon: value?.icon,
            link: value?.link,
            name: value?.name,
            curriculum: {
              connect: {
                id,
              },
            },
          },
        })
      ),
      ...links.map((value) =>
        this.prisma.link.upsert({
          where: {
            id: value?.id || '',
          },
          update: {
            description: value?.description,
            icon: value?.icon,
            href: value?.href,
            name: value?.name,
            updated_at: new Date(),
          },
          create: {
            id: randomUUID(),
            description: value?.description,
            icon: value?.icon,
            href: value?.href,
            name: value?.name,
            curriculum: {
              connect: {
                id,
              },
            },
          },
        })
      ),
      ...languages.map((value) =>
        this.prisma.language.upsert({
          where: {
            id: value?.id || '',
          },
          update: {
            conversation: value?.conversation,
            name: value?.name,
            reading: value?.reading,
            writing: value?.writing,
            updated_at: new Date(),
          },
          create: {
            id: randomUUID(),
            conversation: value?.conversation,
            name: value?.name,
            reading: value?.reading,
            writing: value?.writing,
            curriculum: {
              connect: {
                id,
              },
            },
          },
        })
      ),
      ...educations.map((value) =>
        this.prisma.education.upsert({
          where: {
            id: value?.id || '',
          },
          update: {
            description: value?.description,
            final_date: value?.final_date,
            initial_date: value?.initial_date,
            institution_name: value?.institution_name,
            is_main: value?.is_main,
            level: value?.level,
            situation: value?.situation,
            title: value?.title,
            updated_at: new Date(),
          },
          create: {
            id: randomUUID(),
            description: value?.description,
            final_date: value?.final_date,
            initial_date: value?.initial_date,
            institution_name: value?.institution_name,
            is_main: value?.is_main,
            level: value?.level,
            situation: value?.situation,
            title: value?.title,
            curriculum: {
              connect: {
                id,
              },
            },
          },
        })
      ),
      ...skills.map((value) =>
        this.prisma.skill.upsert({
          where: {
            id: value?.id || '',
          },
          update: {
            name: value?.name,
            updated_at: new Date(),
          },
          create: {
            id: randomUUID(),
            name: value?.name,
            curriculum: {
              connect: {
                id,
              },
            },
          },
        })
      ),
      ...experiences.map((value) =>
        this.prisma.experience.upsert({
          where: {
            id: value?.id || '',
          },
          update: {
            description: value?.description,
            employer: value?.employer,
            final_date: value?.final_date,
            initial_date: value?.initial_date,
            is_main: value?.is_main,
            title: value?.title,
            updated_at: new Date(),
          },
          create: {
            id: randomUUID(),
            description: value?.description,
            employer: value?.employer,
            final_date: value?.final_date,
            initial_date: value?.initial_date,
            is_main: value?.is_main,
            title: value?.title,
            curriculum: {
              connect: {
                id,
              },
            },
          },
        })
      ),
    ])
  }

  async me() {
    return this.prisma.curriculum.findFirst({
      where: {
        user_id: this.request.user.id,
      },
      include: {
        address: true,
        educations: {
          orderBy: {
            initial_date: 'desc',
          },
        },
        experiences: {
          orderBy: {
            initial_date: 'desc',
          },
        },
        languages: true,
        links: true,
        portfolios: true,
        skills: true,
        user: {
          select: {
            avatar: true,
          },
        },
      },
    })
  }

  async findBySlug(slug: string) {
    return this.prisma.curriculum.findFirst({
      where: {
        slug,
        searchable: true,
      },
      include: {
        address: true,
        educations: {
          orderBy: {
            initial_date: 'desc',
          },
        },
        experiences: {
          orderBy: {
            initial_date: 'desc',
          },
        },
        languages: true,
        links: true,
        portfolios: true,
        skills: true,
        user: {
          select: {
            avatar: true,
          },
        },
      },
    })
  }

  async findMany(query?: QueryDto) {
    return await this.prisma.curriculum.findMany({
      where: {
        searchable: true,
        ...(query?.q && {
          OR: [
            {
              address: {
                OR: [
                  {
                    city: {
                      startsWith: query?.q,
                    },
                  },
                  {
                    country: {
                      startsWith: query?.q,
                    },
                  },
                ],
              },
            },
            {
              languages: {
                some: {
                  name: {
                    startsWith: query?.q,
                  },
                },
              },
            },
            {
              public_email: {
                startsWith: query.q,
              },
            },
          ],
        }),
      },
      include: {
        address: true,
        educations: true,
        experiences: true,
        languages: true,
        links: true,
        portfolios: true,
        skills: true,
        user: {
          select: {
            avatar: true,
          },
        },
      },
    })
  }

  async findAll() {
    return this.prisma.curriculum.findMany({
      select: {
        slug: true,
      },
    })
  }

  async avatarUpload(file: Express.Multer.File) {
    await this.avatar.upload(file, this.request.user.id)
  }

  async destroyAvatar() {
    await this.avatar.destroy([this.request.user.id])
  }

  async findProfiles(query: QueryDto) {
    const { q = '', take = 10 } = query

    const mode: Prisma.QueryMode = 'insensitive'

    const where = {
      searchable: true,
      OR: [
        {
          address: {
            OR: [
              {
                city: {
                  contains: q,
                  mode,
                },
              },
              {
                country: {
                  contains: q,
                  mode,
                },
              },
            ],
          },
        },
        {
          public_email: {
            contains: q,
            mode,
          },
        },
        {
          title: {
            contains: q,
            mode,
          },
        },
        {
          first_name: {
            contains: q,
            mode,
          },
        },
        {
          last_name: {
            contains: q.split(' ')[1],
            mode,
          },
        },
      ],
    }

    const count = await this.prisma.curriculum.count({
      where: {
        ...where,
      },
    })

    if (!q)
      return new PaginationDto([], {
        count: 0,
        take,
      })

    const _taken = take > count ? count : take

    const results = await this.prisma.curriculum.findMany({
      take: _taken,
      include: {
        address: true,
        user: {
          select: {
            avatar: true,
          },
        },
      },
      where,
    })

    const parsedData = new PaginationDto(results, {
      count,
      take,
    })

    return parsedData
  }
}
