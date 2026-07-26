import prisma from '../../config/db';
import { AppError } from '../utils/AppError';

export interface IMenuFilterOptions {
  category?: string;
  search?: string;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const createMenuItem = async (payload: {
  name: string;
  recipe: string;
  category: string;
  price: number;
  imageUrl: string;
  videoUrl?: string;
}) => {
  const menuItem = await prisma.menu.create({
    data: payload,
  });

  return menuItem;
};

export const getAllMenuItems = async (filters: IMenuFilterOptions) => {
  const { category, search, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

  const whereConditions: any = {};

  if (category) {
    whereConditions.category = {
      equals: category,
      mode: 'insensitive',
    };
  }

  if (search) {
    whereConditions.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { recipe: { contains: search, mode: 'insensitive' } },
    ];
  }

  const menuItems = await prisma.menu.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return menuItems;
};

export const getSingleMenuItem = async (id: string) => {
  const menuItem = await prisma.menu.findUnique({
    where: { id },
  });

  if (!menuItem) {
    throw new AppError(404, 'Menu item not found');
  }

  return menuItem;
};

export const updateMenuItem = async (
  id: string,
  payload: Partial<{
    name: string;
    recipe: string;
    category: string;
    price: number;
    imageUrl: string;
    videoUrl?: string;
  }>
) => {
  const existingItem = await prisma.menu.findUnique({
    where: { id },
  });

  if (!existingItem) {
    throw new AppError(404, 'Menu item not found');
  }

  const updatedItem = await prisma.menu.update({
    where: { id },
    data: payload,
  });

  return updatedItem;
};

export const deleteMenuItem = async (id: string) => {
  const existingItem = await prisma.menu.findUnique({
    where: { id },
  });

  if (!existingItem) {
    throw new AppError(404, 'Menu item not found');
  }

  await prisma.menu.delete({
    where: { id },
  });

  return { message: 'Menu item deleted successfully' };
};

export const MenuService = {
  createMenuItem,
  getAllMenuItems,
  getSingleMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
