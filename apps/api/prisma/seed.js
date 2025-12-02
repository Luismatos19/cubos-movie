/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL não está configurada. Verifique o arquivo .env',
  );
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

const MOVIES_DATA = [
  {
    title: 'A Origem',
    description:
      'Dom Cobb é um ladrão habilidoso, o melhor absoluto na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho, quando a mente está mais vulnerável.',
    releaseDate: '2010-07-15',
    imageUrl:
      'https://image.tmdb.org/t/p/original/9gk7admalsqW66Q6deRLsebxyDS.jpg',
    rating: 84,
    classification: 14,
    duration: 148,
    revenue: 829895144,
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    genres: ['Ficção Científica', 'Ação', 'Aventura'],
  },
  {
    title: 'Batman: O Cavaleiro das Trevas',
    description:
      'Com a ajuda do tenente Jim Gordon e do promotor público Harvey Dent, Batman tem tudo para tirar o crime de Gotham de uma vez por todas. Mas em breve, os três serão vítimas do Coringa, que pretende lançar Gotham em uma anarquia.',
    releaseDate: '2008-07-16',
    imageUrl:
      'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    rating: 85,
    classification: 12,
    duration: 152,
    revenue: 1004558444,
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    genres: ['Drama', 'Ação', 'Crime'],
  },
  {
    title: 'Interestelar',
    description:
      'As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie.',
    releaseDate: '2014-11-05',
    imageUrl:
      'https://image.tmdb.org/t/p/original/gEU2QniL6E8ahDaX06e8q281jZd.jpg',
    rating: 84,
    classification: 10,
    duration: 169,
    revenue: 701729206,
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    genres: ['Aventura', 'Drama', 'Ficção Científica'],
  },
  {
    title: 'Vingadores: Ultimato',
    description:
      'Após os eventos devastadores de "Vingadores: Guerra Infinita", o universo está em ruínas devido aos esforços do Titã Louco, Thanos. Com a ajuda de aliados remanescentes, os Vingadores devem se reunir mais uma vez para desfazer as ações de Thanos.',
    releaseDate: '2019-04-24',
    imageUrl:
      'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    rating: 83,
    classification: 12,
    duration: 181,
    revenue: 2797800564,
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    genres: ['Aventura', 'Ficção Científica', 'Ação'],
  },
  {
    title: 'Homem-Aranha: Sem Volta Para Casa',
    description:
      'Peter Parker é desmascarado e não consegue mais separar sua vida normal dos grandes riscos de ser um super-herói. Quando ele pede ajuda ao Doutor Estranho, os riscos se tornam ainda mais perigosos, e o forçam a descobrir o que realmente significa ser o Homem-Aranha.',
    releaseDate: '2021-12-15',
    imageUrl:
      'https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4GY0d.jpg',
    rating: 80,
    classification: 12,
    duration: 148,
    revenue: 1921847111,
    trailerUrl: 'https://www.youtube.com/watch?v=CyiiEJRZjSU',
    genres: ['Ação', 'Aventura', 'Ficção Científica'],
  },
];

async function main() {
  console.log('🌱 Iniciando seed...');

  for (const name of DEFAULT_GENRES) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const passwordHash =
    '$2b$10$t/t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.t.';

  let hashedPassword = 'password123';
  try {
    const bcrypt = require('bcrypt');
    hashedPassword = await bcrypt.hash('password123', 10);
  } catch (e) {
    console.warn(
      'bcrypt não encontrado, usando senha em texto plano (pode falhar no login se a API exigir hash)',
    );
  }

  const user = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Usuario Seed 2',
      email: 'seed2@cubos.movie',
      password: hashedPassword,
    },
  });

  for (const movieData of MOVIES_DATA) {
    const { genres, ...data } = movieData;

    const genreRecords = await prisma.genre.findMany({
      where: {
        name: { in: genres },
      },
    });

    const movie = await prisma.movie.create({
      data: {
        ...data,
        releaseDate: new Date(data.releaseDate),
        userId: 2,
        genres: {
          create: genreRecords.map((g) => ({
            genre: { connect: { id: g.id } },
          })),
        },
      },
    });
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed do Prisma', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
