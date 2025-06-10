-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SubjectToTeacher_AB_unique";
