import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/database/prisma.service'
import { ForbiddenException } from 'src/decorators/errors'
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

    const curriculumExist = await this.prisma.curriculum.findFirst({
      where: {
        AND: [
          { id },
          linksToDelete && {
            links: {
              every: {
                id: {
                  in: linksToDelete,
                },
              },
            },
          },
          skillsToDelete && {
            skills: {
              every: {
                id: {
                  in: skillsToDelete,
                },
              },
            },
          },
          languagesToDelete && {
            languages: {
              every: {
                id: {
                  in: languagesToDelete,
                },
              },
            },
          },
          educationsToDelete && {
            educations: {
              every: {
                id: {
                  in: educationsToDelete,
                },
              },
            },
          },
          experiencesToDelete && {
            experiences: {
              every: {
                id: {
                  in: experiencesToDelete,
                },
              },
            },
          },
          portfoliosToDelete && {
            portfolios: {
              every: {
                id: {
                  in: portfoliosToDelete,
                },
              },
            },
          },
        ].filter((value) => value),
      },
    })

    if (!curriculumExist)
      throw new ForbiddenException(CURRICULUM_ERRORS.CURRICULUM_NOT_FOUND)

    if (linksToDelete) {
      await this.prisma.$transaction(
        linksToDelete.map((value) =>
          this.prisma.link.delete({
            where: { id: value },
          })
        )
      )
    }

    if (skillsToDelete) {
      await this.prisma.$transaction(
        skillsToDelete.map((value) =>
          this.prisma.skill.delete({
            where: { id: value },
          })
        )
      )
    }

    if (languagesToDelete) {
      await this.prisma.$transaction(
        languagesToDelete.map((value) =>
          this.prisma.language.delete({
            where: { id: value },
          })
        )
      )
    }

    if (educationsToDelete) {
      await this.prisma.$transaction(
        educationsToDelete.map((value) =>
          this.prisma.education.delete({
            where: { id: value },
          })
        )
      )
    }

    if (experiencesToDelete) {
      await this.prisma.$transaction(
        experiencesToDelete.map((value) =>
          this.prisma.experience.delete({
            where: { id: value },
          })
        )
      )
    }

    if (portfoliosToDelete) {
      await this.prisma.$transaction(
        portfoliosToDelete.map((value) =>
          this.prisma.portfolio.delete({
            where: { id: value },
          })
        )
      )
    }

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
        educations: true,
        experiences: true,
        languages: true,
        links: true,
        portfolios: true,
        skills: true,
      },
    })
  }

  async findBySlug(slug: string) {
    return this.prisma.curriculum.findUnique({
      where: {
        slug,
      },
      include: {
        address: true,
        educations: true,
        experiences: true,
        languages: true,
        links: true,
        portfolios: true,
        skills: true,
      },
    })
  }

  async findMany(query?: QueryDto) {
    return await this.prisma.curriculum.findMany({
      where: {
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

  async findAllSkillsByName(name: string) {
    return await this.prisma.skill.findMany({
      where: {
        name: {
          startsWith: name,
        },
      },
    })
  }
}
