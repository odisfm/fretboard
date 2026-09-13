-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tuning" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Tuning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scale" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shape" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tuning" ADD CONSTRAINT "Tuning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scale" ADD CONSTRAINT "Scale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
