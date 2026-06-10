/*
  Warnings:

  - The primary key for the `tarefas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tarefas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deUsuario` column on the `tarefas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `usuarios` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "tarefas" DROP CONSTRAINT "tarefas_deUsuario_fkey";

-- AlterTable
ALTER TABLE "tarefas" DROP CONSTRAINT "tarefas_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "deUsuario",
ADD COLUMN     "deUsuario" INTEGER,
ADD CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_deUsuario_fkey" FOREIGN KEY ("deUsuario") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
