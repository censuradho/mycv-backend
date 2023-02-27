import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'

enum EducationLevel {
  /*Ensino médio**/
  highSchool = 'highSchool',
  /*Ensino superior**/
  universityEducation = 'universityEducation',
  /*Curso online**/
  onlineCourse = 'onlineCourse',
  /*Curso presencial**/
  classroomCourse = 'classroomCourse',
  /*Certificação**/
  certification = 'certification',
  /*Evento de formação**/
  trainingEvent = 'trainingEvent',
  /*Tecnólogo**/
  technologist = 'technologist',
  /*Técnico**/
  technician = 'technician',
  /*Doutorado**/
  doctorateDegree = 'doctorateDegree',
  /*Pós-graduação**/
  postgraduateStudies = 'postgraduateStudies',
  /*Mestrado**/
  master = 'master',
  /*PHD**/
  phD = 'phD',
  /*Especialização**/
  specialization = 'specialization',
  /*Capacitação**/
  training = 'training',
  /*Aperfeiçoamento**/
  improvement = 'improvement',
  /*Reciclagem**/
  recycling = 'recycling',
  /*Profissionalizante**/
  professionalizing = 'professionalizing',
  /*Extensão**/
  extension = 'extension',
  /*Intercambio**/
  exchange = 'exchange',
}

enum SituationEducation {
  /*Não informar**/
  notInform = 'notInform',
  /*Completo**/
  complete = 'complete',
  /*Cursando**/
  coursing = 'coursing',
  /*Pausado**/
  paused = 'paused',
  /*Incompleto**/
  incomplete = 'incomplete',
}

enum CivilState {
  doNotInform = 'doNotInform',
  married = 'married',
  single = 'single',
  divorced = 'divorced',
}

enum ContactPreference {
  phone = 'phone',
  cellPhone = 'cellPhone',
  whatsapp = 'whatsapp',
  telegram = 'telegram',
  email = 'email',
}

export class Education {
  @IsEnum(EducationLevel)
  level: EducationLevel

  @IsString()
  institution_name: string

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEnum(SituationEducation)
  situation: SituationEducation

  @IsDateString()
  initial_date: string

  @IsDateString()
  final_date: string

  @IsOptional()
  @IsBoolean()
  is_main: boolean
}

export class Experience {
  @IsString()
  employer: string

  @IsString()
  title: string

  @IsDateString()
  initial_date: string

  @IsOptional()
  @IsDateString()
  final_date: string

  @IsOptional()
  @IsBoolean()
  is_main: boolean

  @IsOptional()
  @IsString()
  description: string
}

enum LanguageLevel {
  basic = 'basic',
  intermediate = 'intermediate',
  proficient = 'proficient',
  advanced = 'advanced',
  fluent = 'fluent',
}
export class Language {
  @IsString()
  name: string

  @IsEnum(LanguageLevel)
  conversation: LanguageLevel

  @IsEnum(LanguageLevel)
  reading: LanguageLevel

  @IsEnum(LanguageLevel)
  writing: LanguageLevel
}

export class Skill {
  @IsString()
  name: string
}

export class Link {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @IsString()
  icon: string

  @IsString()
  @IsUrl()
  href: string
}

export class Portfolio {
  @IsString()
  name: string

  @IsString()
  @IsUrl()
  link: string

  @IsString()
  icon: string

  @IsString()
  @IsOptional()
  description: string
}

export class Address {
  @IsString()
  country: string

  @IsString()
  city: string
}

export class CreateCurriculumDto {
  @IsEnum(CivilState)
  civil_state: CivilState

  @IsOptional()
  @IsString()
  availability: string

  @IsString()
  presentation: string

  @IsString()
  phone: string

  @IsString()
  title: string

  @IsString()
  public_email: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsEnum(ContactPreference)
  contact_preference: ContactPreference

  @IsOptional()
  @IsBoolean()
  is_pcd?: boolean

  @IsOptional()
  @IsBoolean()
  searchable?: boolean

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Education)
  @IsArray()
  educations: Education[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Experience)
  @IsArray()
  experiences: Experience[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Language)
  @IsArray()
  languages: Language[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Skill)
  @IsArray()
  skills: Skill[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Link)
  @IsArray()
  links: Link[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Portfolio)
  @IsArray()
  portfolios: Portfolio[]

  @ValidateNested()
  @Type(() => Address)
  address: Address
}
