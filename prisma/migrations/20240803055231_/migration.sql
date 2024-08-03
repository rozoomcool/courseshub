/*
  Warnings:

  - Added the required column `title` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "title" TEXT NOT NULL;
