import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";

// Initialize encryption transformer with key from environment
const encryptionTransformer = new EncryptionTransformer({
  key:
    process.env.ENCRYPTION_KEY ||
    "2b5f7c8e9a1d3f6b8c4e7a2d5f8b1c4e7a2d5f8b1c4e7a2d5f8b1c4e7a2d5f8b",
  algorithm: "aes-256-cbc",
  ivLength: 16,
});

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Normal field - not encrypted
  @Column({ length: 100 })
  name: string;

  // Encrypted field - email will be encrypted in database
  @Column({
    length: 500, // Increased length for encrypted data
    transformer: encryptionTransformer,
  })
  email: string;

  // Encrypted field - SSN will be encrypted in database
  @Column({
    length: 200,
    nullable: true,
    transformer: encryptionTransformer,
  })
  ssn: string;

  // Normal field - for comparison
  @Column({ length: 50, nullable: true })
  phoneNumber: string;

  // Encrypted field - sensitive notes
  @Column({
    type: "text",
    nullable: true,
    transformer: encryptionTransformer,
  })
  sensitiveNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
