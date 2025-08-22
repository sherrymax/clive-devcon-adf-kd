import { Injectable } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AgentData } from '../agent-selector/agent-selector.component'; // Import the AgentData interface
import { Observable } from 'rxjs'; // only need to import from rxjs
import { map } from "rxjs/operators";
import { Message } from '../chat-kd/chat-kd.component'; // Import the Message interface

@Injectable({
  providedIn: 'root'
})

export class KnowledgeDiscoveryService {

  alfresoWithKDHostname: string = '';
  alfrescoUsername: string = '';
  alfrescoPassword: string = '';
  encodedCredentials: string = '';
  httpOptions: any;

  constructor(private appConfig: AppConfigService, private http: HttpClient) {
    this.alfresoWithKDHostname = this.appConfig.get('alfresco-with-kd-hostname');
    this.alfrescoUsername = this.appConfig.get('alfresco-username');
    this.alfrescoPassword = this.appConfig.get('alfresco-password');
    this.encodedCredentials = btoa(`${this.alfrescoUsername}:${this.alfrescoPassword}`);
    this.httpOptions = { headers: new HttpHeaders({ 'Authorization': `Basic ${this.encodedCredentials}` }) };
  }

  loadAgents(): Observable<AgentData[]> {


    var myURL = this.alfresoWithKDHostname + "/alfresco/s/kd/agents?limit=10000";

    return this.http.get<AgentData[]>(myURL, this.httpOptions)
      .pipe(
        map(
          response => response['agents'],
          error => { console.error('Error fetching agents:', error) }
        ));
  }

  invokeKDPrompt(selectedAgentId: string, userMessage: string): Observable<Message> {

    const postData = {
      "agentId": selectedAgentId,
      "prompt": userMessage
    };

    var myURL = this.alfresoWithKDHostname + "/alfresco/s/kd/prompt";
    return this.http.post<Message>(myURL, postData, this.httpOptions).pipe(
      map(response => {
        var aiMessage: Message = {
          id: this.generateId(),
          content: response['answer'],
          sender: 'assistant',
          timestamp: new Date()
        }
        return aiMessage;
      },
        error => {
          console.error('Error fetching agents:', error);
          throw error;
        })

    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

}


