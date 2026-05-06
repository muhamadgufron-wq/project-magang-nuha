-- CreateTable
CREATE TABLE "doctor_master_schedules" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "vip_quota" INTEGER NOT NULL DEFAULT 0,
    "general_quota" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_master_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_master_schedules_uuid_key" ON "doctor_master_schedules"("uuid");

-- AddForeignKey
ALTER TABLE "doctor_master_schedules" ADD CONSTRAINT "doctor_master_schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
