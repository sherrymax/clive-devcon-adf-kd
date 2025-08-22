import { TestBed } from '@angular/core/testing';

import { KnowledgeDiscoveryService } from './knowledge-discovery.service';

describe('KnowledgeDiscoveryService', () => {
  let service: KnowledgeDiscoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnowledgeDiscoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
