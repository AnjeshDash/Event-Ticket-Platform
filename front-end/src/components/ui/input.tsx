import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    React.useEffect(() => {
      setFocused(props.value !== undefined && props.value !== "");
    }, [props.value]);

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={`
              flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm 
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 
              focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${error ? "border-destructive focus:ring-destructive/20" : ""}
              ${focused ? "shadow-lg" : "shadow-sm"}
              ${className}
            `}
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
            </span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
