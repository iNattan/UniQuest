-- CreateTable
CREATE TABLE "direct_confrontation_matches" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "match" INTEGER NOT NULL,
    "team1_id" INTEGER,
    "team2_id" INTEGER,
    "winner_team_id" INTEGER,

    CONSTRAINT "direct_confrontation_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "all_against_all_matches" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,

    CONSTRAINT "all_against_all_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "all_against_all_placements" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "all_against_all_placements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "direct_confrontation_matches" ADD CONSTRAINT "direct_confrontation_matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_confrontation_matches" ADD CONSTRAINT "direct_confrontation_matches_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_confrontation_matches" ADD CONSTRAINT "direct_confrontation_matches_team1_id_fkey" FOREIGN KEY ("team1_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_confrontation_matches" ADD CONSTRAINT "direct_confrontation_matches_team2_id_fkey" FOREIGN KEY ("team2_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_confrontation_matches" ADD CONSTRAINT "direct_confrontation_matches_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "all_against_all_matches" ADD CONSTRAINT "all_against_all_matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "all_against_all_matches" ADD CONSTRAINT "all_against_all_matches_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "all_against_all_placements" ADD CONSTRAINT "all_against_all_placements_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "all_against_all_matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "all_against_all_placements" ADD CONSTRAINT "all_against_all_placements_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
