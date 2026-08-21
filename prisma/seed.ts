import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
})
class SeedModule {}

async function main() {
  const app =
    await NestFactory.createApplicationContext(
      SeedModule,
    );

  try {
    const prisma =
      app.get(PrismaService);

    const categoryNames = [
      'announcement',
      'qna',
      'misc',
    ];

    for (const name of categoryNames) {
      await prisma.category.upsert({
        where: {
          name,
        },
        update: {
          deletedAt: null,
        },
        create: {
          name,
        },
      });
    }

    console.log(
      '기본 카테고리 Seed 완료',
    );
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});