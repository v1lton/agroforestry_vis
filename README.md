# Agroforestry Vis

A web-based tool to assist in crop selection for agroforestry systems. This project aims to provide visual and interactive assistance in planning sustainable agroforestry implementations.

## About

Agroforestry Vis is being developed as a final thesis project at Centro de Informática - UFPE (Universidade Federal de Pernambuco). The tool helps users make informed decisions about crop selection and placement in agroforestry systems by providing visual representations and data-driven recommendations.

> 🚧 **Note**: This project is in early development stage. Feedback and contributions are highly encouraged!

## Prerequisites

- Docker
- Docker Compose
- Git

## Technologies

- Ruby 3.2.2
- Rails 7.2.1
- PostgreSQL 14
- Docker
- Node.js

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agroforestry-vis.git
   cd agroforestry-vis
   ```

2. Create a `.env.development` file in the root directory with the following content:
   ```env
   DATABASE_HOST=database
   DATABASE_PORT=5432
   RAILS_ENV=development
   POSTGRES_PASSWORD=password
   POSTGRES_USER=postgres
   ```

3. Build and start the containers:
   ```bash
   docker-compose build
   docker-compose up
   ```

4. In a new terminal, create and set up the database:
   ```bash
   docker-compose exec app rails db:create db:migrate
   ```

5. Access the application at `http://localhost:3000`

## Development

The application runs in a Docker environment with hot-reloading enabled. The source code is mounted as a volume, so any changes you make will be reflected immediately.

### Database

PostgreSQL 14 runs in a separate container with the following configuration:
- Host: database
- Port: 5432
- Default user: postgres
- Password: password (configured in .env.development)

The database data is persisted in a Docker volume named `postgres_data`.

### Testing

```bash
docker-compose exec app rails test
```

## Environment Variables

The project uses a `.env.development` file for configuration. Here's the required structure:

```env
DATABASE_HOST=database
DATABASE_PORT=5432
RAILS_ENV=development
POSTGRES_PASSWORD=password
POSTGRES_USER=postgres
```

Make sure to add this file to your `.gitignore` to prevent sensitive information from being committed:
```
.env.development
.env.*
```

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Contact

Wilton Silva - wrs@cin.ufpe.br

## Acknowledgments

- Centro de Informática - UFPE
