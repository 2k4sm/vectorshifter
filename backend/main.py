from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import List, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineData(BaseModel):
    nodes: List[Dict[str, str]]
    edges: List[Dict[str, str]]

def has_cycle(graph):
    """
    Detect if the directed graph has a cycle using DFS.
    """
    path = set()
    visited = set()

    def dfs(node):
        if node in path:
            return True
        if node in visited:
            return False
        
        path.add(node)
        
        neighbors = graph.get(node, [])
        for neighbor in neighbors:
            if dfs(neighbor):
                return True
                
        path.remove(node)
        visited.add(node)
        return False

    for node in graph:
        if node not in visited:
            if dfs(node):
                return True
    return False

@app.get('/pipelines/parse')
def parse_pipeline(pipeline_data: str = Query(...)):
    try:
        data = json.loads(pipeline_data)
        print("Received pipeline data:", data)

        graph = {}
        
        for node in data['nodes']:
            node_id = node['id']
            graph[node_id] = []

        for edge in data['edges']:
            source = edge['source']
            target = edge['target']
            graph[source].append(target)

        print("Graph representation:", graph)

        is_dag = not has_cycle(graph)

        response_data = {
            'num_nodes': len(data['nodes']),
            'num_edges': len(data['edges']),
            'is_dag': is_dag
        }
        
        print("Response:", response_data)
        return response_data
        
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))