-- CreateTable
CREATE TABLE "score" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
