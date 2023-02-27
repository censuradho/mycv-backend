-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "photo" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculums" (
    "id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "searchable" BOOLEAN NOT NULL DEFAULT true,
    "civil_state" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "public_email" TEXT NOT NULL,
    "contact_preference" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_pcd" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "initial_date" TIMESTAMP(3) NOT NULL,
    "final_date" TIMESTAMP(3),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "initial_date" TIMESTAMP(3) NOT NULL,
    "final_date" TIMESTAMP(3),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "office" TEXT NOT NULL,
    "description" CHAR(500),
    "company_site" TEXT,
    "curriculum_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conversation" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "writing" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" CHAR(500),
    "icon" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" CHAR(500),
    "curriculum_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users" USING HASH ("username");

-- CreateIndex
CREATE UNIQUE INDEX "curriculums_user_id_key" ON "curriculums"("user_id");

-- CreateIndex
CREATE INDEX "curriculums_public_email_idx" ON "curriculums" USING HASH ("public_email");

-- CreateIndex
CREATE INDEX "languages_name_idx" ON "languages" USING HASH ("name");

-- CreateIndex
CREATE UNIQUE INDEX "files_user_id_key" ON "files"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_curriculum_id_key" ON "addresses"("curriculum_id");

-- CreateIndex
CREATE INDEX "addresses_country_city_region_idx" ON "addresses"("country", "city", "region");

-- AddForeignKey
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
