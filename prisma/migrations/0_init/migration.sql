-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "description" TEXT,
    "subcategory" TEXT,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "tableNumber" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentProvider" TEXT NOT NULL DEFAULT 'PESAPAL',
    "paymentReference" TEXT,
    "pesapalTrackingId" TEXT,
    "notes" TEXT,
    "feedbackRequestSent" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderId" UUID NOT NULL,
    "menuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderId","menuId")
);

-- CreateTable
CREATE TABLE "Session" (
    "phoneNumber" TEXT NOT NULL,
    "tableNumber" TEXT,
    "cart" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'INITIAL',
    "activeCategory" TEXT,
    "activePage" INTEGER NOT NULL DEFAULT 1,
    "lastSearchTerm" TEXT,
    "activeSubcategory" TEXT,
    "filterMinPrice" INTEGER,
    "filterMaxPrice" INTEGER,
    "isPriceFiltering" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("phoneNumber")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID,
    "phoneNumber" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_menu_category" ON "Menu"("category");

-- CreateIndex
CREATE INDEX "idx_menu_description_trgm" ON "Menu" USING GIN ("description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_menu_name_trgm" ON "Menu" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_menu_subcategory" ON "Menu"("subcategory");

-- CreateIndex
CREATE INDEX "idx_order_created" ON "Order"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_order_table_status" ON "Order"("tableNumber", "status");

-- CreateIndex
CREATE INDEX "idx_order_item_menu" ON "OrderItem"("menuId");

-- CreateIndex
CREATE INDEX "idx_order_item_order" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "idx_session_phone" ON "Session"("phoneNumber");

-- CreateIndex
CREATE INDEX "idx_session_table_status" ON "Session"("tableNumber", "status");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_orderId_idx" ON "Feedback"("orderId");

-- CreateIndex
CREATE INDEX "Feedback_phoneNumber_idx" ON "Feedback"("phoneNumber");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

