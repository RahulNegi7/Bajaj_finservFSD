const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Invalid input. Expected {"data": ["A->B", ...]}' });
        }

        const validEntryRegex = /^[A-Za-z0-9_]+->[A-Za-z0-9_]+$/;
        
        const invalid_entries = [];
        const duplicate_edges = [];
        const edges = [];
        const seenEdges = new Set();
        
        for (const item of data) {
            if (typeof item !== 'string' || !validEntryRegex.test(item)) {
                invalid_entries.push(item);
            } else {
                if (seenEdges.has(item)) {
                    duplicate_edges.push(item);
                } else {
                    seenEdges.add(item);
                    const [u, v] = item.split('->');
                    edges.push({ u, v });
                }
            }
        }

        // Processing Hierarchy
        const adj = new Map();
        const inDegree = new Map();
        const nodes = new Set();

        for (const {u, v} of edges) {
            if (!adj.has(u)) adj.set(u, []);
            adj.get(u).push(v);
            nodes.add(u);
            nodes.add(v);
            if (!inDegree.has(u)) inDegree.set(u, 0);
            if (!inDegree.has(v)) inDegree.set(v, 0);
            inDegree.set(v, inDegree.get(v) + 1);
        }

        let total_cycles = 0;
        
        const buildTree = (root, visiting = new Set(), visited = new Set(), currentDepth = 1, depthMap = { max: 1 }) => {
            if (currentDepth > depthMap.max) depthMap.max = currentDepth;

            if (visiting.has(root)) {
                return { has_cycle: true }; 
            }
            if (visited.has(root)) {
                // If it's already visited completely, it's a cross edge or forward edge.
                // Depending on graph structure, we might re-enter if multiple paths exist, but typical tree structure is expected.
                // We'll treat it as visited.
                return {}; 
            }
            
            visiting.add(root);
            
            const tree = {};
            const children = adj.get(root) || [];
            
            let cycleDetected = false;
            for (const child of children) {
                const childTree = buildTree(child, visiting, visited, currentDepth + 1, depthMap);
                tree[child] = childTree;
                if (childTree.has_cycle) {
                    cycleDetected = true;
                }
            }
            
            visiting.delete(root);
            visited.add(root);
            
            if (cycleDetected) {
                return { has_cycle: true, ...tree };
            }
            
            return tree;
        };

        const hierarchies = [];
        
        // Find roots (inDegree == 0)
        let total_trees = 0;
        let largest_tree_root = null;
        let largest_tree_size = -1; 

        const processedNodes = new Set();
        
        // Process true roots first
        for (const node of nodes) {
            if (inDegree.get(node) === 0) {
                const depthMap = { max: 1 };
                const treeObj = buildTree(node, new Set(), processedNodes, 1, depthMap);
                
                if (treeObj.has_cycle) {
                    total_cycles++;
                    hierarchies.push({
                        root: node,
                        tree: {},
                        has_cycle: true
                    });
                } else {
                    total_trees++;
                    hierarchies.push({
                        root: node,
                        tree: treeObj,
                        depth: depthMap.max
                    });

                    if (depthMap.max > largest_tree_size) {
                        largest_tree_size = depthMap.max;
                        largest_tree_root = node;
                    } else if (depthMap.max === largest_tree_size) {
                        if (largest_tree_root === null || node.localeCompare(largest_tree_root) < 0) {
                            largest_tree_root = node;
                        }
                    }
                }
            }
        }

        // Process remaining nodes (disconnected components that are purely cycles)
        for (const node of nodes) {
            if (!processedNodes.has(node)) {
                // This means it's part of a cycle component with no inDegree=0 node
                total_cycles++;
                const depthMap = { max: 1 };
                const treeObj = buildTree(node, new Set(), processedNodes, 1, depthMap);
                
                hierarchies.push({
                    root: node,
                    tree: {},
                    has_cycle: true
                });
            }
        }

        res.json({
            user_id: "Rahulnegi_23012005",
            email_id: "rn9052@srmist.edu.in",
            college_roll_number: "RA2311003011445",
            hierarchies,
            invalid_entries,
            duplicate_edges,
            summary: {
                total_trees,
                total_cycles,
                largest_tree_root
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
