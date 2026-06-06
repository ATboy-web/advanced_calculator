using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;

namespace AdvancedCalculator.Services
{
    public class MathEngine
    {
        private bool _useDegrees = true;
        public bool UseDegrees { get => _useDegrees; set => _useDegrees = value; }

        private static readonly Dictionary<string, Func<double, double>> _funcs = new()
        {
            ["sin"] = x => x, // handled separately with degree mode
            ["cos"] = x => x,
            ["tan"] = x => x,
            ["asin"] = x => Math.Asin(x),
            ["acos"] = x => Math.Acos(x),
            ["atan"] = x => Math.Atan(x),
            ["sinh"] = x => Math.Sinh(x),
            ["cosh"] = x => Math.Cosh(x),
            ["tanh"] = x => Math.Tanh(x),
            ["ln"] = x => Math.Log(x),
            ["log"] = x => Math.Log10(x),
            ["log2"] = x => Math.Log2(x),
            ["sqrt"] = x => Math.Sqrt(x),
            ["cbrt"] = x => Math.Pow(x, 1.0 / 3.0),
            ["abs"] = x => Math.Abs(x),
            ["exp"] = x => Math.Exp(x),
            ["ceil"] = x => Math.Ceiling(x),
            ["floor"] = x => Math.Floor(x),
            ["round"] = x => Math.Round(x),
            ["sign"] = x => Math.Sign(x),
        };

        private static readonly Dictionary<string, double> _constants = new()
        {
            ["pi"] = Math.PI,
            ["π"] = Math.PI,
            ["e"] = Math.E,
            ["phi"] = 1.618033988749895,
        };

        public double Evaluate(string expression)
        {
            var tokens = Tokenize(expression.Replace(" ", "").ToLower());
            int pos = 0;
            double result = ParseExpression(tokens, ref pos);
            return result;
        }

        private List<string> Tokenize(string expr)
        {
            var tokens = new List<string>();
            int i = 0;
            while (i < expr.Length)
            {
                char c = expr[i];
                if (char.IsDigit(c) || c == '.')
                {
                    int start = i;
                    while (i < expr.Length && (char.IsDigit(expr[i]) || expr[i] == '.')) i++;
                    tokens.Add(expr[start..i]);
                }
                else if (char.IsLetter(c) || c == 'π')
                {
                    int start = i;
                    while (i < expr.Length && (char.IsLetter(expr[i]) || expr[i] == 'π')) i++;
                    tokens.Add(expr[start..i]);
                }
                else if ("+-*/^()!%".Contains(c))
                {
                    // Handle unary minus
                    if (c == '-' && (tokens.Count == 0 || tokens[^1] == "(" || "+-*/^(".Contains(tokens[^1])))
                    {
                        tokens.Add("neg");
                    }
                    else
                    {
                        tokens.Add(c.ToString());
                    }
                    i++;
                }
                else if (c == ',')
                {
                    tokens.Add(",");
                    i++;
                }
                else
                {
                    i++;
                }
            }
            return tokens;
        }

        // Expression = Term (('+' | '-') Term)*
        private double ParseExpression(List<string> tokens, ref int pos)
        {
            double left = ParseTerm(tokens, ref pos);
            while (pos < tokens.Count && (tokens[pos] == "+" || tokens[pos] == "-"))
            {
                string op = tokens[pos++];
                double right = ParseTerm(tokens, ref pos);
                left = op == "+" ? left + right : left - right;
            }
            return left;
        }

        // Term = Power (('*' | '/') Power)*
        private double ParseTerm(List<string> tokens, ref int pos)
        {
            double left = ParsePower(tokens, ref pos);
            while (pos < tokens.Count && (tokens[pos] == "*" || tokens[pos] == "/" || tokens[pos] == "%"))
            {
                string op = tokens[pos++];
                double right = ParsePower(tokens, ref pos);
                left = op switch
                {
                    "*" => left * right,
                    "/" => left / right,
                    "%" => left % right,
                    _ => left
                };
            }
            return left;
        }

        // Power = Unary ('^' Unary)*
        private double ParsePower(List<string> tokens, ref int pos)
        {
            double left = ParseUnary(tokens, ref pos);
            if (pos < tokens.Count && tokens[pos] == "^")
            {
                pos++;
                double right = ParseUnary(tokens, ref pos);
                left = Math.Pow(left, right);
            }
            return left;
        }

        private double ParseUnary(List<string> tokens, ref int pos)
        {
            if (pos < tokens.Count && tokens[pos] == "neg")
            {
                pos++;
                return -ParsePrimary(tokens, ref pos);
            }
            return ParsePrimary(tokens, ref pos);
        }

        private double ParsePrimary(List<string> tokens, ref int pos)
        {
            if (pos >= tokens.Count) return 0;

            string token = tokens[pos];

            // Number
            if (double.TryParse(token, NumberStyles.Any, CultureInfo.InvariantCulture, out double num))
            {
                pos++;
                // Check for factorial
                if (pos < tokens.Count && tokens[pos] == "!")
                {
                    pos++;
                    return Factorial(num);
                }
                return num;
            }

            // Constants
            if (_constants.ContainsKey(token))
            {
                pos++;
                double val = _constants[token];
                if (pos < tokens.Count && tokens[pos] == "!")
                {
                    pos++;
                    return Factorial(val);
                }
                return val;
            }

            // Functions
            if (_funcs.ContainsKey(token) || token == "neg")
            {
                bool isNeg = token == "neg";
                if (isNeg) pos++;
                string funcName = isNeg ? null : token;
                if (!isNeg) pos++;

                if (pos < tokens.Count && tokens[pos] == "(")
                {
                    pos++; // skip (
                    double arg = ParseExpression(tokens, ref pos);
                    if (pos < tokens.Count && tokens[pos] == ")") pos++;

                    double result = isNeg ? -arg : ApplyFunction(funcName, arg);
                    if (pos < tokens.Count && tokens[pos] == "!")
                    {
                        pos++;
                        result = Factorial(result);
                    }
                    return result;
                }
                // Function without parens (e.g., sin 30)
                if (!isNeg)
                {
                    double arg = ParsePrimary(tokens, ref pos);
                    double result = ApplyFunction(funcName, arg);
                    if (pos < tokens.Count && tokens[pos] == "!")
                    {
                        pos++;
                        result = Factorial(result);
                    }
                    return result;
                }
            }

            // Parenthesized expression
            if (token == "(")
            {
                pos++;
                double result = ParseExpression(tokens, ref pos);
                if (pos < tokens.Count && tokens[pos] == ")") pos++;
                if (pos < tokens.Count && tokens[pos] == "!")
                {
                    pos++;
                    result = Factorial(result);
                }
                return result;
            }

            pos++;
            return 0;
        }

        private double ApplyFunction(string func, double arg)
        {
            return func switch
            {
                "sin" => _useDegrees ? Math.Sin(arg * Math.PI / 180) : Math.Sin(arg),
                "cos" => _useDegrees ? Math.Cos(arg * Math.PI / 180) : Math.Cos(arg),
                "tan" => _useDegrees ? Math.Tan(arg * Math.PI / 180) : Math.Tan(arg),
                "asin" => _useDegrees ? Math.Asin(arg) * 180 / Math.PI : Math.Asin(arg),
                "acos" => _useDegrees ? Math.Acos(arg) * 180 / Math.PI : Math.Acos(arg),
                "atan" => _useDegrees ? Math.Atan(arg) * 180 / Math.PI : Math.Atan(arg),
                "sinh" => Math.Sinh(arg),
                "cosh" => Math.Cosh(arg),
                "tanh" => Math.Tanh(arg),
                "ln" => Math.Log(arg),
                "log" => Math.Log10(arg),
                "log2" => Math.Log2(arg),
                "sqrt" => Math.Sqrt(arg),
                "cbrt" => Math.Pow(arg, 1.0 / 3.0),
                "abs" => Math.Abs(arg),
                "exp" => Math.Exp(arg),
                "ceil" => Math.Ceiling(arg),
                "floor" => Math.Floor(arg),
                "round" => Math.Round(arg),
                "sign" => Math.Sign(arg),
                _ => arg
            };
        }

        public static double Factorial(double n)
        {
            if (n < 0 || n != Math.Floor(n)) return double.NaN;
            if (n > 170) return double.PositiveInfinity;
            double result = 1;
            for (int i = 2; i <= (int)n; i++) result *= i;
            return result;
        }

        // Derivative using central difference
        public double Derivative(string expr, double x, double h = 1e-8)
        {
            var engine = new MathEngine { UseDegrees = _useDegrees };
            string ex = expr.Replace("x", $"({x + h})");
            string ey = expr.Replace("x", $"({x - h})");
            return (engine.Evaluate(ex) - engine.Evaluate(ey)) / (2 * h);
        }

        // Integral using Simpson's rule
        public double Integral(string expr, double a, double b, int n = 1000)
        {
            if (n % 2 != 0) n++;
            double h = (b - a) / n;
            var engine = new MathEngine { UseDegrees = _useDegrees };
            double sum = 0;

            for (int i = 0; i <= n; i++)
            {
                double x = a + i * h;
                string e = expr.Replace("x", $"({x})");
                double y = engine.Evaluate(e);
                sum += (i == 0 || i == n) ? y : (i % 2 == 0) ? 2 * y : 4 * y;
            }
            return sum * h / 3;
        }

        // Newton's method for root finding
        public double FindRoot(string expr, double x0, int maxIter = 100, double tol = 1e-10)
        {
            var engine = new MathEngine { UseDegrees = _useDegrees };
            for (int i = 0; i < maxIter; i++)
            {
                string e = expr.Replace("x", $"({x0})");
                double fx = engine.Evaluate(e);
                if (Math.Abs(fx) < tol) return x0;
                double dfx = Derivative(expr, x0);
                if (Math.Abs(dfx) < 1e-15) break;
                x0 -= fx / dfx;
            }
            return x0;
        }

        // Solve quadratic ax^2 + bx + c = 0
        public (double? x1, double? x2) SolveQuadratic(double a, double b, double c)
        {
            double disc = b * b - 4 * a * c;
            if (disc < 0) return (null, null);
            if (disc == 0) { double x = -b / (2 * a); return (x, x); }
            return ((-b + Math.Sqrt(disc)) / (2 * a), (-b - Math.Sqrt(disc)) / (2 * a));
        }

        // Create function for graphing
        public Func<double, double> CreateFunction(string expr)
        {
            return x =>
            {
                try
                {
                    var engine = new MathEngine { UseDegrees = _useDegrees };
                    string e = expr.Replace("x", $"({x})");
                    return engine.Evaluate(e);
                }
                catch { return double.NaN; }
            };
        }

        // Number base conversion
        public string BaseConvert(string value, int fromBase, int toBase)
        {
            long num = Convert.ToInt64(value, fromBase);
            return Convert.ToString(num, toBase).ToUpper();
        }

        // GCD
        public static long Gcd(long a, long b) { a = Math.Abs(a); b = Math.Abs(b); while (b != 0) { (a, b) = (b, a % b); } return a; }

        // LCM
        public static long Lcm(long a, long b) => Math.Abs(a * b) / Gcd(a, b);

        // Permutation
        public static double Perm(int n, int r) => Factorial(n) / Factorial(n - r);

        // Combination
        public static double Comb(int n, int r) => Perm(n, r) / Factorial(r);
    }
}
