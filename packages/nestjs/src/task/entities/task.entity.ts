import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 200 })
  description: string;
}
