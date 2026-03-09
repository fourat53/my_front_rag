"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DotsThreeVerticalIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  CodeIcon,
  DotsThreeOutlineIcon,
  MagnifyingGlassIcon,
  FloppyDiskIcon,
  DownloadIcon,
  EyeIcon,
  LayoutIcon,
  PaletteIcon,
  UserIcon,
  CreditCardIcon,
  GearIcon,
  KeyboardIcon,
  TranslateIcon,
  BellIcon,
  EnvelopeIcon,
  ShieldIcon,
  QuestionIcon,
  FileTextIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { themes } from "@/providers/theme-provider";

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const;

const roleItems = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "Other", value: "other" },
];

export default function FormExample() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  });
  const { theme, setTheme } = useTheme();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Please fill in your details below</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <DotsThreeVerticalIcon />
              <span className="sr-only">More options</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuItem>
                  <FileIcon />
                  New File
                  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderIcon />
                  New Folder
                  <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FolderOpenIcon />
                    Open Recent
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <CodeIcon />
                          Project Alpha
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CodeIcon />
                          Project Beta
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <DotsThreeOutlineIcon />
                            More Projects
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>
                                <CodeIcon />
                                Project Gamma
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CodeIcon />
                                Project Delta
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <MagnifyingGlassIcon />
                          Browse...
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FloppyDiskIcon />
                  Save
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DownloadIcon />
                  Export
                  <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      email: checked === true,
                    })
                  }
                >
                  <EyeIcon />
                  Show Sidebar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      sms: checked === true,
                    })
                  }
                >
                  <LayoutIcon />
                  Show Status Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <PaletteIcon />
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}
                        >
                          {themes.map((themeOption, index) => (
                            <DropdownMenuRadioItem
                              key={index}
                              value={themeOption.mode}
                            >
                              {themeOption.icon}
                              {themeOption.mode}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <UserIcon />
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <GearIcon />
                    Settings
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <KeyboardIcon />
                          Keyboard Shortcuts
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TranslateIcon />
                          Language
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <BellIcon />
                            Notifications
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                  Notification Types
                                </DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                  checked={notifications.push}
                                  onCheckedChange={(checked) =>
                                    setNotifications({
                                      ...notifications,
                                      push: checked === true,
                                    })
                                  }
                                >
                                  <BellIcon />
                                  Push Notifications
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                  checked={notifications.email}
                                  onCheckedChange={(checked) =>
                                    setNotifications({
                                      ...notifications,
                                      email: checked === true,
                                    })
                                  }
                                >
                                  <EnvelopeIcon />
                                  Email Notifications
                                </DropdownMenuCheckboxItem>
                              </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ShieldIcon />
                          Privacy & Security
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <QuestionIcon />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileTextIcon />
                  Documentation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <SignOutIcon />
                  Sign Out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                <Input
                  id="small-form-name"
                  placeholder="Enter your name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                <Select items={roleItems} defaultValue={null}>
                  <SelectTrigger id="small-form-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roleItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="small-form-framework">Framework</FieldLabel>
              <Combobox items={frameworks}>
                <ComboboxInput
                  id="small-form-framework"
                  placeholder="Select a framework"
                  required
                />
                <ComboboxContent>
                  <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
              <Textarea
                id="small-form-comments"
                placeholder="Add any additional comments"
              />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
