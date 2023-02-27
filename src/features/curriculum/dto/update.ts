import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

import {
  CreateCurriculumDto,
  Experience,
  Portfolio,
  Education,
  Address,
  Language,
  Link,
  Skill,
} from './create'

class UpdatePortfolioDto extends Portfolio {
  @IsOptional()
  @IsString()
  id: string
}

class UpdateExperience extends Experience {
  @IsOptional()
  @IsString()
  id: string
}

class UpdateEducation extends Education {
  @IsOptional()
  @IsString()
  id: string
}

class UpdateLanguage extends Language {
  @IsOptional()
  @IsString()
  id: string
}

class UpdateLink extends Link {
  @IsOptional()
  @IsString()
  id: string
}

class UpdateSkill extends Skill {
  @IsOptional()
  @IsString()
  id: string
}

class UpdateAddress extends Address {
  @IsOptional()
  @IsString()
  id: string
}

export class UpdateCurriculumDto extends CreateCurriculumDto {
  @IsOptional()
  @IsString()
  id: string

  @IsString()
  slug: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePortfolioDto)
  @IsArray()
  portfolios: UpdatePortfolioDto[]

  @IsOptional()
  @IsString({ each: true })
  portfoliosToDelete: string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateExperience)
  @IsArray()
  experiences: UpdateExperience[]

  @IsOptional()
  @IsString({ each: true })
  experiencesToDelete: string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducation)
  @IsArray()
  educations: UpdateEducation[]

  @IsOptional()
  @IsString({ each: true })
  educationsToDelete: string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateLanguage)
  @IsArray()
  languages: UpdateLanguage[]

  @IsOptional()
  @IsString({ each: true })
  languagesToDelete: string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateLink)
  @IsArray()
  links: UpdateLink[]

  @IsOptional()
  @IsString({ each: true })
  linksToDelete: string[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkill)
  @IsArray()
  skills: UpdateSkill[]

  @IsOptional()
  @IsString({ each: true })
  skillsToDelete: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddress)
  address: UpdateAddress
}
