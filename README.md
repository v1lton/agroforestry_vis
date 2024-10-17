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

2. Build and start the containers:
   ```bash
   docker-compose build
   docker-compose up
   ```

3. Create and set up the database:
   ```bash
   docker-compose exec app rails db:create db:migrate
   ```

4. Access the application at `http://localhost:3000`

## Development

The application runs in a Docker environment with hot-reloading enabled. The source code is mounted as a volume, so any changes you make will be reflected immediately.

### Database

PostgreSQL is used as the database and runs in a separate container. The database configuration is managed through `config/database.yml` and environment variables.

### Testing

```bash
docker-compose exec app rails test
```

## Environment Variables

While the project currently doesn't use a `.env` file, it's recommended to add one for better security and configuration management. Here's a suggested `.env` file structure:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgres://postgres:your_secure_password@db:5432/app_development

# Rails
RAILS_ENV=development
RAILS_MASTER_KEY=your_master_key
```

Add this file to your `.gitignore` to prevent sensitive information from being committed:
```
.env
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
