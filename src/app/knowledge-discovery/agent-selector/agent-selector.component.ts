import { Component, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { KnowledgeDiscoveryService } from '../services/knowledge-discovery.service';

export interface AgentData {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    createdOn: string;
    isGlobal: string;
}

@Component({
    selector: 'agent-selector',
    templateUrl: './agent-selector.component.html',
    styleUrls: ['./agent-selector.component.scss'],
    providers: [KnowledgeDiscoveryService]
})
export class AgentSelectorComponent {

    @Output() agentIsSelected = new EventEmitter<any>();

    showPopup = false;
    tempSelectedAgentID: string | null = null;
    agents: AgentData[] = [];
    selectedAgentID: string = '';
    selectedAgent: AgentData | null = null;
    loading: boolean = false;
    error: string = '';
    agentId: string = '';


    constructor(
        private appConfig: AppConfigService,
        private kdService: KnowledgeDiscoveryService
    ) {
        
    }

    ngOnInit() {
        this.loadAgents();
    }

    loadAgents() {
        this.loading = true;
        this.error = '';
        this.kdService.loadAgents().subscribe({
            next: (data) => {
                console.log('API Data:', data)  ; // Log the data received from the API
                this.agents = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load agents from API';
                this.loading = false;
                console.error('API Error:', err); // Log the error received from the API
            }
        });

    }

    openPopup(): void {
        this.showPopup = true;
        this.tempSelectedAgentID = '';
    }

    closePopup(): void {
        this.showPopup = false;
        this.tempSelectedAgentID = '';
    }

    confirmSelection(): void {
        this.agentIsSelected.emit(this.getSelectedAgentData());
        if (this.tempSelectedAgentID) {
            this.selectedAgentID = this.tempSelectedAgentID;
            this.closePopup();
        }
    }

    getSelectedAgentData(): AgentData | undefined {
        return this.agents.find(agent => agent.id === this.tempSelectedAgentID);
    }
}