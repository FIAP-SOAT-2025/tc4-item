import {
  PrismaClient,
  ItemCategory,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpar banco de dados (opcional, mas útil para desenvolvimento)
  await cleanDatabase();

  // Criar itens do cardápio
  await prisma.item.create({
    data: {
      name: 'X-Burger Especial',
      description:
        'Hambúrguer artesanal com queijo, alface, tomate e molho especial',
      images: ['https://placehold.co/600x400', 'https://placehold.co/600x400'],
      price: 22.9,
      quantity: 100,
      category: ItemCategory.SANDWICH,
    },
  });

  await prisma.item.create({
    data: {
      name: 'X-Salada Duplo',
      description:
        'Dois hambúrgueres artesanais, queijo cheddar, alface, tomate e cebola caramelizada',
      images: [
        'https://placehold.co/600x400',
        'https://placehold.co/600x400',
        'https://placehold.co/600x400',
      ],
      price: 29.9,
      quantity: 100,
      category: ItemCategory.SANDWICH,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Veggie Burger',
      description:
        'Hambúrguer vegetariano com queijo, alface, tomate e molho especial',
      images: [
        'https://placehold.co/600x400',
        'https://placehold.co/600x400',
        'https://placehold.co/600x400',
      ],
      price: 24.9,
      quantity: 50,
      category: ItemCategory.SANDWICH,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Batata Frita Grande',
      description: 'Porção grande de batatas fritas crocantes',
      images: ['https://placehold.co/600x400'],
      price: 18.9,
      quantity: 200,
      category: ItemCategory.SIDE,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Anéis de Cebola',
      description: 'Anéis de cebola empanados e fritos',
      images: ['https://placehold.co/600x400'],
      price: 15.9,
      quantity: 150,
      category: ItemCategory.SIDE,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Refrigerante Cola 500ml',
      description: 'Refrigerante tipo cola gelado',
      images: ['https://placehold.co/600x400'],
      price: 7.9,
      quantity: 300,
      category: ItemCategory.BEVERAGE,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Suco Natural de Laranja 300ml',
      description: 'Suco de laranja 100% natural',
      images: ['https://placehold.co/600x400'],
      price: 9.9,
      quantity: 100,
      category: ItemCategory.BEVERAGE,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Sorvete de Chocolate',
      description: 'Sorvete cremoso de chocolate com calda',
      images: ['https://placehold.co/600x400'],
      price: 12.9,
      quantity: 80,
      category: ItemCategory.DESSERT,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Brownie com Sorvete',
      description: 'Brownie quente com sorvete de baunilha',
      images: ['https://placehold.co/600x400'],
      price: 16.9,
      quantity: 60,
      category: ItemCategory.DESSERT,
    },
  });

  console.log('Seed executado com sucesso!');
}

// Função para limpar o banco antes de inserir novos dados
async function cleanDatabase() {
  await prisma.item.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
