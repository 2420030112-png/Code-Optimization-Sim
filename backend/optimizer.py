import ast
import random

class ConstantFolder(ast.NodeTransformer):
    """
    Traverses the Python AST and pre-computes operations between numbers (e.g. 5 * 4 -> 20).
    """
    def __init__(self):
        super().__init__()
        self.folding_count = 0

    def visit_BinOp(self, node):
        # First recurse down left and right children
        node.left = self.visit(node.left)
        node.right = self.visit(node.right)

        # If both are numbers (Constant nodes in python >=3.8)
        if isinstance(node.left, ast.Constant) and isinstance(node.right, ast.Constant):
            lval = node.left.value
            rval = node.right.value
            
            # Pre-evaluate operation
            val = None
            if isinstance(node.op, ast.Add):
                val = lval + rval
            elif isinstance(node.op, ast.Sub):
                val = lval - rval
            elif isinstance(node.op, ast.Mult):
                val = lval * rval
            elif isinstance(node.op, ast.Div):
                val = lval / rval if rval != 0 else 0
            elif isinstance(node.op, ast.Mod):
                val = lval % rval if rval != 0 else 0
            elif isinstance(node.op, ast.Pow):
                val = lval ** rval

            if val is not None:
                self.folding_count += 1
                return ast.Constant(value=val)

        return node

class ConstantPropagator(ast.NodeTransformer):
    """
    Replaces variables with known constants.
    """
    def __init__(self, constants_table):
        super().__init__()
        self.constants = constants_table # Dict of variable_name -> float/int value
        self.propagation_count = 0

    def visit_Name(self, node):
        # If it's a variable being read and is in the constants table, replace with constant value
        if isinstance(node.ctx, ast.Load) and node.id in self.constants:
            self.propagation_count += 1
            return ast.Constant(value=self.constants[node.id])
        return node

    def visit_BinOp(self, node):
        node.left = self.visit(node.left)
        node.right = self.visit(node.right)
        
        # Fold inline if they became constants after propagation
        if isinstance(node.left, ast.Constant) and isinstance(node.right, ast.Constant):
            lval = node.left.value
            rval = node.right.value
            val = None
            if isinstance(node.op, ast.Add): val = lval + rval
            elif isinstance(node.op, ast.Sub): val = lval - rval
            elif isinstance(node.op, ast.Mult): val = lval * rval
            elif isinstance(node.op, ast.Div): val = lval / rval if rval != 0 else 0
            elif isinstance(node.op, ast.Mod): val = lval % rval if rval != 0 else 0
            elif isinstance(node.op, ast.Pow): val = lval ** rval
            
            if val is not None:
                return ast.Constant(value=val)
        return node

def optimize_python_code(code_str):
    """
    Optimizes simple assignment statements in Python:
    1. Constant Folding
    2. Constant Propagation
    3. Common Subexpression Elimination
    """
    # Split code to work line-by-line or statement-by-statement
    lines = [l.strip() for l in code_str.split('\n') if l.strip()]
    
    statements = []
    for line in lines:
        if not line or line.startswith('#') or line.startswith('//'):
            continue
        try:
            tree = ast.parse(line)
            if tree.body and isinstance(tree.body[0], ast.Assign):
                statements.append(tree.body[0])
        except Exception:
            # Skip syntax errors for simple parsing fallback
            pass

    # Step 1: Constant Folding
    folder = ConstantFolder()
    folded_statements = []
    for stmt in statements:
        # Clone and fold
        folded_stmt = folder.visit(stmt)
        folded_statements.append(folded_stmt)

    # Step 2: Constant Propagation
    # We trace constants line-by-line
    propagated_statements = []
    active_constants = {}
    propagator_stats = {'prop_count': 0}

    for stmt in folded_statements:
        # Propagate variables in rhs
        propagator = ConstantPropagator(active_constants)
        stmt.value = propagator.visit(stmt.value)
        propagator_stats['prop_count'] += propagator.propagation_count
        
        # Save constant bindings
        targets = [t.id for t in stmt.targets if isinstance(t, ast.Name)]
        if targets:
            var_name = targets[0]
            if isinstance(stmt.value, ast.Constant):
                active_constants[var_name] = stmt.value.value
            else:
                active_constants.pop(var_name, None) # Kill variable constant status
                
        propagated_statements.append(stmt)

    # Step 3: Common Subexpression Elimination (CSE)
    cse_statements = []
    active_expressions = {} # Dict of "serialized_expr" -> "var_name"
    cse_count = 0

    def serialize_expr(node):
        if isinstance(node, ast.Constant):
            return str(node.value)
        if isinstance(node, ast.Name):
            return node.id
        if isinstance(node, ast.BinOp):
            left_str = serialize_expr(node.left)
            right_str = serialize_expr(node.right)
            op_sym = '+'
            if isinstance(node.op, ast.Add): op_sym = '+'
            elif isinstance(node.op, ast.Sub): op_sym = '-'
            elif isinstance(node.op, ast.Mult): op_sym = '*'
            elif isinstance(node.op, ast.Div): op_sym = '/'
            elif isinstance(node.op, ast.Mod): op_sym = '%'
            elif isinstance(node.op, ast.Pow): op_sym = '**'
            return f"({left_str} {op_sym} {right_str})"
        return ""

    for stmt in propagated_statements:
        rhs_node = stmt.value
        targets = [t.id for t in stmt.targets if isinstance(t, ast.Name)]
        var_name = targets[0] if targets else '_'

        expr_str = serialize_expr(rhs_node)
        is_binary = isinstance(rhs_node, ast.BinOp)
        
        replaced = False
        if is_binary and expr_str and expr_str in active_expressions:
            # Replace expression with variable reference
            stmt.value = ast.Name(id=active_expressions[expr_str], ctx=ast.Load())
            replaced = True
            cse_count += 1

        cse_statements.append(stmt)

        # Kill expression keys depending on the modified target variable
        if var_name != '_':
            active_expressions = {
                k: v for k, v in active_expressions.items() 
                if var_name not in k and v != var_name
            }

        # Store subexpression in map
        if is_binary and not replaced and var_name != '_':
            active_expressions[expr_str] = var_name

    # Step 4: Reconstruct Code from AST
    final_lines = []
    symbol_table = {}
    for stmt in cse_statements:
        targets = [t.id for t in stmt.targets if isinstance(t, ast.Name)]
        if not targets:
            continue
        var_name = targets[0]
        rhs_str = serialize_expr(stmt.value)
        final_lines.append(f"{var_name} = {rhs_str}")
        
        if isinstance(stmt.value, ast.Constant):
            symbol_table[var_name] = str(stmt.value.value)

    final_code = '\n'.join(final_lines)

    # Compile TAC
    tac_lines = []
    temp_count = 1

    def process_tac_expr(node):
        nonlocal temp_count
        if isinstance(node, ast.Constant):
            return str(node.value)
        if isinstance(node, ast.Name):
            return node.id
        if isinstance(node, ast.BinOp):
            l_temp = process_tac_expr(node.left)
            r_temp = process_tac_expr(node.right)
            
            op_sym = '+'
            if isinstance(node.op, ast.Add): op_sym = '+'
            elif isinstance(node.op, ast.Sub): op_sym = '-'
            elif isinstance(node.op, ast.Mult): op_sym = '*'
            elif isinstance(node.op, ast.Div): op_sym = '/'
            elif isinstance(node.op, ast.Mod): op_sym = '%'
            elif isinstance(node.op, ast.Pow): op_sym = '**'
            
            new_temp = f"t{temp_count}"
            temp_count += 1
            tac_lines.append(f"{new_temp} = {l_temp} {op_sym} {r_temp}")
            return new_temp
        return ""

    for stmt in cse_statements:
        targets = [t.id for t in stmt.targets if isinstance(t, ast.Name)]
        var_name = targets[0] if targets else '_'
        rhs_temp = process_tac_expr(stmt.value)
        if var_name != '_':
            tac_lines.append(f"{var_name} = {rhs_temp}")

    # Build steps output (mocking for frontend steps mapping)
    total_reductions = folder.folding_count + propagator_stats['prop_count'] + cse_count
    simulated_speedup = min(10 + total_reductions * 8.5 + cse_count * 15, 85)
    
    return {
        "original_code": code_str,
        "final_code": final_code,
        "symbol_table": symbol_table,
        "tac": tac_lines,
        "stats": {
            "expressionsReduced": total_reductions,
            "executionSpeedup": round(simulated_speedup, 1),
            "memorySavedBytes": total_reductions * 4,
            "redundantOpsRemoved": cse_count
        }
    }
