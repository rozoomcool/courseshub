/*
  Warnings:

  - Added the required column `previewUrl` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('LECTURE', 'TEST');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "previewUrl" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" SERIAL NOT NULL,
    "type" "StageType" NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonMedia" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "LessonMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonMedia" ADD CONSTRAINT "LessonMedia_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
