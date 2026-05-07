-- AlterTable
ALTER TABLE "doctor_schedules" ADD COLUMN     "master_schedule_id" INTEGER;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_master_schedule_id_fkey" FOREIGN KEY ("master_schedule_id") REFERENCES "doctor_master_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
