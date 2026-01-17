/*
  Warnings:

  - The values [SHIPPING_FEE] on the enum `SystemSettingKey` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SystemSettingKey_new" AS ENUM ('ESTIMATED_DELIVERY_DAYS', 'SHIPPING_INFO', 'SUPPORT_EMAIL', 'MAINTENANCE_MODE');
ALTER TYPE "SystemSettingKey" RENAME TO "SystemSettingKey_old";
ALTER TYPE "SystemSettingKey_new" RENAME TO "SystemSettingKey";
DROP TYPE "public"."SystemSettingKey_old";
COMMIT;

-- AlterTable
ALTER TABLE "system_settings" ALTER COLUMN "value" DROP NOT NULL;
