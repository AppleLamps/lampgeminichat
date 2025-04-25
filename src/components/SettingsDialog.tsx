
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/context/ApiKeyContext";
import { Key, Save, X, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImagen3 } from "@/context/Imagen3Context";
import { Switch } from "@/components/ui/switch";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { apiKey, setApiKey, clearApiKey, isKeySet } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  // Imagen 3 toggle
  const { imagen3Enabled, setImagen3Enabled } = useImagen3();

  const handleSave = () => {
    setApiKey(inputValue.trim());
    onOpenChange(false);
  };

  const handleReset = () => {
    clearApiKey();
    setInputValue("");
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your Google Gemini API key to enable the application's functionality.
            Your key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key" className="text-sm font-medium">
                Gemini API Key
              </Label>
              {isKeySet && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={toggleShowApiKey}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              )}
            </div>

        {/* Imagen 3 Toggle */}
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="imagen3-toggle" className="text-sm font-medium">
            Use Imagen 3 for high-powered photo generation
          </Label>
          <Switch
            id="imagen3-toggle"
            checked={imagen3Enabled}
            onCheckedChange={setImagen3Enabled}
          />
        </div>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={cn(
                  "pr-10 font-mono text-sm transition-all",
                  inputValue ? "tracking-normal" : "tracking-wider letter-spacing-2",
                )}
                placeholder="Enter your API key"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Info className="h-3 w-3" />
              Get your API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">Google AI Studio</a>
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
            <h4 className="font-medium">About API keys</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Your API key is stored only in your browser's local storage</li>
              <li>It's never sent to our servers or shared with third parties</li>
              <li>You can remove it at any time using the "Reset" button</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            disabled={!isKeySet}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!inputValue.trim()}
              className="gap-1.5"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
