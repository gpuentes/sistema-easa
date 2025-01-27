/*
  Warnings:

  - Made the column `quantidade` on table `produtos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "produtos" ALTER COLUMN "quantidade" SET NOT NULL,
ALTER COLUMN "quantidade" SET DEFAULT 0;
