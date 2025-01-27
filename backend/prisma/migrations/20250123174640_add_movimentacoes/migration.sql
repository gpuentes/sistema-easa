/*
  Warnings:

  - You are about to drop the `movimentos` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `preco` on table `produtos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantidade` on table `produtos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "movimentos" DROP CONSTRAINT "movimentos_produtoId_fkey";

-- Primeiro, atualiza os registros existentes
UPDATE "produtos" SET "preco" = 0 WHERE "preco" IS NULL;

-- Altera a coluna para não aceitar nulos
ALTER TABLE "produtos" ALTER COLUMN "preco" SET NOT NULL;

-- DropTable
DROP TABLE "movimentos";

-- CreateTable
CREATE TABLE "Movimentacao" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,
    "produtoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movimentacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
