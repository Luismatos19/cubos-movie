import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesRepository } from '../../infra/repositories/movies.repository';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly moviesRepository: MoviesRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Checking for movie releases today...');
    const today = new Date();
    const movies = await this.moviesRepository.findByReleaseDate(today);

    for (const movie of movies) {
      this.logger.log(
        `Movie "${movie.title}" is premiering today! Sending email...`,
      );
      // this.emailService.send(...)
    }
  }

  async sendReleaseReminder(email: string, movieTitle: string) {
    this.logger.log(
      `Sending email to ${email}: The movie "${movieTitle}" is premiering today!`,
    );
    // Real email sending logic would go here (e.g., using nodemailer)
  }
}
