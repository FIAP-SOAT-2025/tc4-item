-- CreateIndex
CREATE INDEX "idx_item_category_status" ON "Item"("category", "isDeleted");
