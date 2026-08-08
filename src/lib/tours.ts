import fs from 'fs';
import path from 'path';
import { Tour } from '@/types/tour';

const dataDirectory = path.join(process.cwd(), 'data', 'tours');

export function getAllTours(): Tour[] {
  const fileNames = fs.readdirSync(dataDirectory);
  const tours: Tour[] = [];

  for (const fileName of fileNames) {
    if (fileName.endsWith('.json') && fileName !== 'rutas_migracion.json') {
      const filePath = path.join(dataDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      try {
        const tourData: Tour = JSON.parse(fileContents);
        tours.push(tourData);
      } catch (err) {
        console.error(`Error parsing ${fileName}:`, err);
      }
    }
  }

  return tours;
}

export function getTourBySlug(slug: string): Tour | null {
  const fileNames = fs.readdirSync(dataDirectory);
  for (const fileName of fileNames) {
    if (fileName.endsWith('.json') && fileName !== 'rutas_migracion.json') {
      const filePath = path.join(dataDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      try {
        const tourData: Tour = JSON.parse(fileContents);
        if (tourData.slug === slug || fileName === `${slug.replace(/-/g, '_')}.json`) {
          return tourData;
        }
      } catch (err) {
        // continue
      }
    }
  }

  return null;
}
