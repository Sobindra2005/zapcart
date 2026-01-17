/*
  Warnings:

  - The `description` column on the `system_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SystemSettingKey" AS ENUM ('SHIPPING_FEE', 'ESTIMATED_DELIVERY_DAYS', 'SHIPPING_INFO', 'SUPPORT_EMAIL', 'MAINTENANCE_MODE');

-- AlterTable
ALTER TABLE "system_settings" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
