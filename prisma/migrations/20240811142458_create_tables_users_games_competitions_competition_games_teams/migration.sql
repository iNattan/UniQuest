/*
  Warnings:

  - You are about to drop the `competition_tests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "competition_tests" DROP CONSTRAINT "competition_tests_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "competition_tests" DROP CONSTRAINT "competition_tests_test_id_fkey";

-- DropTable
DROP TABLE "competition_tests";

-- DropTable
DROP TABLE "tests";

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "min_participant" INTEGER NOT NULL,
    "max_participant" INTEGER NOT NULL,
    "first_score" INTEGER NOT NULL,
    "second_score" INTEGER NOT NULL,
    "third_score" INTEGER NOT NULL,
    "general_score" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "system_deleted" INTEGER,
    "system_date_deleted" TIMESTAMP(3),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_games" (
    "id" SERIAL NOT NULL,
    "local" TEXT NOT NULL,
    "date_game" TIMESTAMP(3) NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "competition_games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "competition_games" ADD CONSTRAINT "competition_games_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_games" ADD CONSTRAINT "competition_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
