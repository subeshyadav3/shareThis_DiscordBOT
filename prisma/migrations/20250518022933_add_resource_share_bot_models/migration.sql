-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "uploader" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);
