import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export class EnvirontmentVariables {
  @IsInt()
  @Min(0)
  @Max(65535)
  NEST_PORT: number;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN: string;

  @IsString()
  @IsNotEmpty()
  PGHOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  PGPORT: number;

  @IsString()
  @IsNotEmpty()
  PGUSER: string;

  @IsString()
  PGPASSWORD: string;

  @IsString()
  @IsNotEmpty()
  PGDATABASE: string;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  @IsInt()
  @IsPositive()
  REDIS_TTL: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvirontmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
