-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notification" BOOLEAN NOT NULL DEFAULT true,
    "reminder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);
