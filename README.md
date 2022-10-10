- Members can borrow books with conditions
  - [x] Members may not borrow more than 2 books
  - [x] Borrowed books are not borrowed by other members
  - [x] Member is currently not being penalized
- Member returns the book with conditions
  - [x] The returned book is a book that the member has borrowed
  - [x] If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
  - [x] Shows all existing books and quantities
  - [x] Books that are being borrowed are not counted
- Member check
  - [x] Shows all existing members
  - [x] The number of books being borrowed by each member

### How to run this Project?

1. clone this project first
2. if you already installed docker on your machine, just execute this command

```
docker-compose up -d --build
```

3. After that, please check to browser for seeing SWAGGER API Documentation

```
http://localhost:3000/api
```

4. then, run migration for applying database schema

```
npx prisma migrate deploy
```

5. then, for the last. run db seed for seeding dummy data

```
npx prisma db seed
```

6. Everything awesome.

```
Thank you !!!
```

my email : dheariarachman@gmail.com
