-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'diagnostic';

-- CreateIndex
CREATE INDEX "Offer_kind_visible_order_idx" ON "Offer"("kind", "visible", "order");
