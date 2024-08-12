-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "system_deleted" INTEGER,
    "system_date_deleted" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
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

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date_event" TIMESTAMP(3) NOT NULL,
    "start_registration" TIMESTAMP(3) NOT NULL,
    "final_registration" TIMESTAMP(3) NOT NULL,
    "min_participant" INTEGER NOT NULL,
    "max_participant" INTEGER NOT NULL,
    "local" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "system_deleted" INTEGER,
    "system_date_deleted" TIMESTAMP(3),

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_tests" (
    "id" SERIAL NOT NULL,
    "local" TEXT NOT NULL,
    "date_test" TIMESTAMP(3) NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,

    CONSTRAINT "competition_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "situation" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "system_deleted" INTEGER,
    "system_date_deleted" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "competition_tests" ADD CONSTRAINT "competition_tests_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_tests" ADD CONSTRAINT "competition_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
