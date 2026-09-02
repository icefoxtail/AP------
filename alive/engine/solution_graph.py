"""Canonical solution-graph contracts for the universal variant engine.

The graph is intentionally a small structural representation.  Numeric
values, coefficients, labels, and node ids are not part of graph identity;
operation names, semantic roles, execution order, and dependency topology are.
Family adapters may provide aliases and equivalence classes, but this module
never guesses mathematical equivalence from prose.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any, Mapping


GRAPH_SCHEMA_VERSION = "0.1.0"


class SolutionGraphError(ValueError):
    """Raised when a candidate graph violates the Phase 0 contract."""


def _non_negative_int(value: Any, field: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise SolutionGraphError(f"{field} must be a non-negative integer")
    return value


def _roles(value: Any, field: str) -> list[str]:
    if isinstance(value, str):
        value = [value]
    if not isinstance(value, list) or not all(isinstance(item, str) and item.strip() for item in value):
        raise SolutionGraphError(f"{field} must be a string or non-empty string array")
    return [item.strip() for item in value]


def _canonical_op(value: Any, registry: Mapping[str, str]) -> str:
    if not isinstance(value, str) or not value.strip():
        raise SolutionGraphError("node.op must be a non-empty string")
    operation = value.strip()
    return str(registry.get(operation, operation))


def _edge_endpoints(edge: Any, index: int) -> tuple[str, str]:
    if not isinstance(edge, dict):
        raise SolutionGraphError(f"edges[{index}] must be an object")
    source = edge.get("source", edge.get("from"))
    target = edge.get("target", edge.get("to"))
    if not isinstance(source, str) or not source.strip() or not isinstance(target, str) or not target.strip():
        raise SolutionGraphError(f"edges[{index}] must contain source and target node ids")
    return source.strip(), target.strip()


def _canonical_payload(graph: dict[str, Any]) -> dict[str, Any]:
    return {
        "schemaVersion": GRAPH_SCHEMA_VERSION,
        "nodes": [
            {
                "role": node["role"],
                "op": node["op"],
                "inputRole": node["inputRole"],
                "outputRole": node["outputRole"],
                "order": node["order"],
            }
            for node in graph["nodes"]
        ],
        "edges": graph["edges"],
        "coreDecisionCount": graph["coreDecisionCount"],
        "branchCount": graph["branchCount"],
        "newConceptCount": graph["newConceptCount"],
    }


def graph_fingerprint(graph: dict[str, Any]) -> str:
    payload = _canonical_payload(graph)
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def normalize_solution_graph(
    value: Any,
    *,
    operation_registry: Mapping[str, str] | None = None,
) -> dict[str, Any]:
    """Return a deterministic graph with ids removed from its identity.

    ``value`` may be a graph object or a bare node array.  The normalized
    output keeps node ids for traceability, but the fingerprint is calculated
    solely from canonical structural fields and remapped edge topology.
    """

    registry = operation_registry or {}
    if isinstance(value, list):
        raw_nodes, raw_edges, raw_meta = value, [], {}
    elif isinstance(value, dict):
        raw_nodes = value.get("nodes")
        raw_edges = value.get("edges", [])
        raw_meta = value
    else:
        raise SolutionGraphError("solutionGraph must be an object or node array")

    if not isinstance(raw_nodes, list) or not raw_nodes:
        raise SolutionGraphError("solutionGraph.nodes must be a non-empty array")
    if not isinstance(raw_edges, list):
        raise SolutionGraphError("solutionGraph.edges must be an array")

    nodes: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for index, raw in enumerate(raw_nodes):
        if not isinstance(raw, dict):
            raise SolutionGraphError(f"nodes[{index}] must be an object")
        node_id = raw.get("nodeId", raw.get("id"))
        if not isinstance(node_id, str) or not node_id.strip():
            raise SolutionGraphError(f"nodes[{index}].nodeId must be a non-empty string")
        node_id = node_id.strip()
        if node_id in seen_ids:
            raise SolutionGraphError(f"duplicate solution graph node id: {node_id}")
        seen_ids.add(node_id)
        role = raw.get("role", "core")
        if role not in {"core", "preprocess"}:
            raise SolutionGraphError(f"nodes[{index}].role must be core or preprocess")
        order = raw.get("order", index)
        if not isinstance(order, int) or isinstance(order, bool) or order < 0:
            raise SolutionGraphError(f"nodes[{index}].order must be a non-negative integer")
        nodes.append(
            {
                "nodeId": node_id,
                "role": role,
                "op": _canonical_op(raw.get("op"), registry),
                "inputRole": _roles(raw.get("inputRole", []), f"nodes[{index}].inputRole"),
                "outputRole": _roles(raw.get("outputRole", []), f"nodes[{index}].outputRole"),
                "order": order,
            }
        )

    role_rank = {"preprocess": 0, "core": 1}
    nodes.sort(key=lambda item: (item["order"], role_rank[item["role"]], item["op"], item["nodeId"]))
    node_position = {node["nodeId"]: position for position, node in enumerate(nodes)}
    edges: list[dict[str, int]] = []
    for index, raw_edge in enumerate(raw_edges):
        try:
            source_value = raw_edge.get("source", raw_edge.get("from")) if isinstance(raw_edge, dict) else None
            target_value = raw_edge.get("target", raw_edge.get("to")) if isinstance(raw_edge, dict) else None
            if isinstance(source_value, int) and not isinstance(source_value, bool):
                source_value = raw_nodes[source_value]["nodeId"]
            if isinstance(target_value, int) and not isinstance(target_value, bool):
                target_value = raw_nodes[target_value]["nodeId"]
            edge_for_parse = {"source": source_value, "target": target_value}
        except (IndexError, KeyError, TypeError) as error:
            raise SolutionGraphError(f"edges[{index}] references an invalid node index") from error
        source, target = _edge_endpoints(edge_for_parse, index)
        if source not in node_position or target not in node_position:
            raise SolutionGraphError(f"edges[{index}] references an unknown node")
        edges.append({"from": node_position[source], "to": node_position[target]})
    edges.sort(key=lambda item: (item["from"], item["to"]))

    normalized = {
        "schemaVersion": GRAPH_SCHEMA_VERSION,
        "nodes": nodes,
        "edges": edges,
        "coreDecisionCount": _non_negative_int(raw_meta.get("coreDecisionCount", 0), "coreDecisionCount"),
        "branchCount": _non_negative_int(raw_meta.get("branchCount", 0), "branchCount"),
        "newConceptCount": _non_negative_int(raw_meta.get("newConceptCount", 0), "newConceptCount"),
    }
    normalized["graphFingerprint"] = graph_fingerprint(normalized)
    return normalized


def strip_preprocess_graph(value: Any, *, operation_registry: Mapping[str, str] | None = None) -> dict[str, Any]:
    """Remove preprocess nodes and remap edges for the C proof."""

    graph = normalize_solution_graph(value, operation_registry=operation_registry)
    core_nodes = [node for node in graph["nodes"] if node["role"] == "core"]
    core_ids = {node["nodeId"] for node in core_nodes}
    # Re-normalize the retained nodes so that edge indices are rebuilt from
    # the retained graph instead of leaking the original node positions.
    retained_edges = [
        {"from": graph["nodes"][edge["from"]]["nodeId"], "to": graph["nodes"][edge["to"]]["nodeId"]}
        for edge in graph["edges"]
        if graph["nodes"][edge["from"]]["nodeId"] in core_ids and graph["nodes"][edge["to"]]["nodeId"] in core_ids
    ]
    return normalize_solution_graph(
        {
            "nodes": core_nodes,
            "edges": retained_edges,
            "coreDecisionCount": graph["coreDecisionCount"],
            "branchCount": graph["branchCount"],
            "newConceptCount": graph["newConceptCount"],
        },
        operation_registry=operation_registry,
    )


__all__ = [
    "GRAPH_SCHEMA_VERSION",
    "SolutionGraphError",
    "graph_fingerprint",
    "normalize_solution_graph",
    "strip_preprocess_graph",
]
