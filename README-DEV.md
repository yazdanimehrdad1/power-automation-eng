# Development Guide

## Database Models and Migrations

### Adding a New Model

1. **Add Model to Schema**
   - Open `prisma/schema.prisma`
   - Add your new model definition following this structure:
   ```prisma
   model YourNewModel {
     id        String   @id @default(cuid())
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     // Add your fields here
     field1    String
     field2    Int?
     // Add relations if needed
     // relationField OtherModel @relation(fields: [otherId], references: [id])
     // otherId      String
   }
   ```

2. **Create Migration**
   ```bash
   # Create and apply a new migration 
   Note: if you are running the migration localy, you need to use DATABASE-URL with localhost
   npx prisma migrate dev --name descriptive_name_of_changes
   ```
   This command will:
   - Create a new migration file in `prisma/migrations`
   - Apply the migration to your database
   - Regenerate the Prisma Client

3. **Update Prisma Client**
   ```bash
   # The migrate dev command automatically updates the Prisma Client
   # But if you need to manually update it:
   npx prisma generate
   ```

4. **Verify Migration**
   ```bash
   # Check your database schema
   npx prisma db pull

   # Or view your database in Prisma Studio
   npx prisma studio
   ```

### Important Notes

- **Backup**: Always backup your database before running migrations in production
- **Naming**: Use meaningful names for your migrations (e.g., `add_user_profile` or `create_post_comments`)
- **Version Control**: Commit both the schema changes and the migration files
- **Production**: For production deployments, use `prisma migrate deploy` instead of `prisma migrate dev`

### Common Field Types

```prisma
model Example {
  // Basic types
  stringField    String
  intField       Int
  floatField     Float
  booleanField   Boolean
  dateField      DateTime
  
  // Optional fields (nullable)
  optionalString String?
  
  // Fields with default values
  defaultString  String   @default("default value")
  defaultDate    DateTime @default(now())
  
  // Unique fields
  uniqueField    String   @unique
  
  // Enums
  status         Status   @default(ACTIVE)
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
}
```

### Common Relations

```prisma
// One-to-One relation
model User {
  id        String   @id @default(cuid())
  profile   Profile?
}

model Profile {
  id     String @id @default(cuid())
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}

// One-to-Many relation
model Post {
  id       String   @id @default(cuid())
  comments Comment[]
}

model Comment {
  id     String @id @default(cuid())
  post   Post   @relation(fields: [postId], references: [id])
  postId String
}

// Many-to-Many relation
model Category {
  id    String    @id @default(cuid())
  posts Post[]
}

model Post {
  id         String     @id @default(cuid())
  categories Category[]
}
```

### Best Practices

1. **Naming Conventions**
   - Use PascalCase for model names (e.g., `UserProfile`)
   - Use camelCase for field names (e.g., `createdAt`, `userId`)
   - Use SCREAMING_SNAKE_CASE for enum values (e.g., `ACTIVE`, `PENDING`)

2. **Required vs Optional Fields**
   - Make fields optional (using `?`) when the data might not be available
   - Use required fields (no `?`) for essential data
   - Consider using `@default` for fields that should always have a value

3. **Relations**
   - Always define both sides of a relation
   - Use meaningful names for relation fields
   - Consider using `onDelete` and `onUpdate` referential actions when needed

4. **Indexes**
   - Add indexes for fields that will be frequently queried
   - Use compound indexes for fields that are often queried together
   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String
     age       Int
     
     @@index([name, age])
   }
   ```

5. **Documentation**
   - Add comments to your schema to explain complex models or fields
   ```prisma
   /// This model represents a user's profile information
   model UserProfile {
     /// The user's preferred language for the application
     language String @default("en")
   }
   ``` 