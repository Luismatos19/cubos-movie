/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL não está configurada. Verifique o arquivo .env');
}

const pool = new Pool({
  connectionString: databaseUrl.split('?')[0],
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: ['error'],
});

const DEFAULT_GENRES = [
  'Ação',
  'Aventura',
  'Animação',
  'Comédia',
  'Crime',
  'Documentário',
  'Drama',
  'Família',
  'Fantasia',
  'Ficção Científica',
  'Guerra',
  'Mistério',
  'Romance',
  'Suspense',
  'Terror',
];

async function main() {
  await prisma.genre.createMany({
    data: DEFAULT_GENRES.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed do Prisma', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

