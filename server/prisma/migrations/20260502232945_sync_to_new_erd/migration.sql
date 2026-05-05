-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_specializationId_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_userId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_doctorId_fkey";

-- DropIndex
DROP INDEX "doctors_userId_key";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_pkey",
DROP COLUMN "bio",
DROP COLUMN "createdAt",
DROP COLUMN "experience",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "specializationId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "practice_number" VARCHAR(50),
ADD COLUMN     "specialization" VARCHAR(100),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "doctors_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_vip" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "role" SET DEFAULT 'PATIENT',
ALTER COLUMN "role" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "schedules";

-- DropTable
DROP TABLE "specializations";

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(20),
    "birth_date" DATE,
    "phone" VARCHAR(20),
    "address" TEXT,
    "identity_number" VARCHAR(50),
    "insurance_type" VARCHAR(50),
    "insurance_number" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_schedules" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "vip_quota" INTEGER NOT NULL DEFAULT 0,
    "general_quota" INTEGER NOT NULL DEFAULT 0,
    "booked_vip" INTEGER NOT NULL DEFAULT 0,
    "booked_general" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registered" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "reschedule_from_id" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    "booking_code" VARCHAR(20) NOT NULL,
    "patient_type" VARCHAR(20) NOT NULL DEFAULT 'GENERAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registered_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reschedule_history" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "bookings_id" INTEGER NOT NULL,
    "old_slot_id" INTEGER NOT NULL,
    "new_slot_id" INTEGER NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "reason" VARCHAR(255),

    CONSTRAINT "reschedule_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_change_logs" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "doctor_schedule_id" INTEGER NOT NULL,
    "changed_by" INTEGER NOT NULL,
    "old_start_time" TIME,
    "old_end_time" TIME,
    "new_start_time" TIME,
    "new_end_time" TIME,
    "change_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_uuid_key" ON "patients"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_schedules_uuid_key" ON "doctor_schedules"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "registered_uuid_key" ON "registered"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "registered_booking_code_key" ON "registered"("booking_code");

-- CreateIndex
CREATE UNIQUE INDEX "reschedule_history_uuid_key" ON "reschedule_history"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_change_logs_uuid_key" ON "schedule_change_logs"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_uuid_key" ON "doctors"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_user_id_key" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered" ADD CONSTRAINT "registered_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered" ADD CONSTRAINT "registered_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "doctor_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered" ADD CONSTRAINT "registered_reschedule_from_id_fkey" FOREIGN KEY ("reschedule_from_id") REFERENCES "registered"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_history" ADD CONSTRAINT "reschedule_history_bookings_id_fkey" FOREIGN KEY ("bookings_id") REFERENCES "registered"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_history" ADD CONSTRAINT "reschedule_history_old_slot_id_fkey" FOREIGN KEY ("old_slot_id") REFERENCES "doctor_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_history" ADD CONSTRAINT "reschedule_history_new_slot_id_fkey" FOREIGN KEY ("new_slot_id") REFERENCES "doctor_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_change_logs" ADD CONSTRAINT "schedule_change_logs_doctor_schedule_id_fkey" FOREIGN KEY ("doctor_schedule_id") REFERENCES "doctor_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_change_logs" ADD CONSTRAINT "schedule_change_logs_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
