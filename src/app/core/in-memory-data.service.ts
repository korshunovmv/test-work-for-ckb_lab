import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Issue } from '../model/issue.model';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const issues: Issue[] = [
    ];
    return { issues } ;
  }
}
