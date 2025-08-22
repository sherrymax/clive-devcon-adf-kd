import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@alfresco/adf-core';
import { KnowledgeDiscoveryService } from '../services/knowledge-discovery.service';
    

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'chat-kd',
  templateUrl: "./chat-kd.component.html",
  styleUrls: ["./chat-kd.component.scss"],
  providers: [KnowledgeDiscoveryService]
})

export class ChatKDComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  responses: String[] = []
  messages: Message[] = [];
  currentMessage: string = '';
  isTyping: boolean = false;
  private shouldScrollToBottom: boolean = false;
  selectedAgentID: string = '';
  selectedAgentName: string = '';

  constructor(private http: HttpClient,
    private appConfig: AppConfigService,
    private kdService: KnowledgeDiscoveryService) {
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isTyping) return;

    const userMessage: Message = {
      id: this.generateId(),
      content: this.currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageContent = this.currentMessage;
    this.currentMessage = '';
    this.shouldScrollToBottom = true;

    this.invokeKDPrompt(messageContent);
  }

  

  private invokeKDPrompt(userMessage: string) {
    this.isTyping = true;
    this.shouldScrollToBottom = true;

    setTimeout(() => {

      this.kdService.invokeKDPrompt(this.selectedAgentID, userMessage).subscribe({
        next: (response: Message) => {
          this.isTyping = false;
          this.shouldScrollToBottom = true;
          console.log('Response received in parent >>>:', response);

          if (response) {
            this.messages.push(response);
            this.scrollToBottom();
          } else {
            console.error('No response received from the server');
          }
        },
        error: (error) => {
          this.isTyping = false;
          console.error('Error invoking KD prompt:', error);
        }
      });
      
    }, 1500 + Math.random() * 1000);

  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages = [];
    this.currentMessage = '';
    this.isTyping = false;
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private scrollToBottom() {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }

  onAgentSelected(item: any) {
    console.log('Selected Agent:', item);
    this.selectedAgentID = item.id;
    this.selectedAgentName = item.name;
  }
}