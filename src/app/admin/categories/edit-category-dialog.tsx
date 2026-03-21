"use client";

import { useState } from "react";
import { updateCategoryAction } from "@/actions/category";
import { Button } from "@/components/ui/button";

interface CategoryEditDialogProps {
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

export function EditCategoryDialog({ category }: CategoryEditDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        formData.append("id", category.id);
        await updateCategoryAction(undefined, formData);
        setIsSaving(false);
        setIsOpen(false);
        // Refresh the page to show updated data
        window.location.reload();
    }

    return (
        <div className="relative inline">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                Edit
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl z-10">
                    <h3 className="text-sm font-medium text-white mb-3">Edit Category</h3>
                    <form action={handleSubmit}>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor={`edit-name-${category.id}`} className="block text-xs font-medium text-slate-400 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id={`edit-name-${category.id}`}
                                    name="name"
                                    defaultValue={category.name}
                                    required
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor={`edit-slug-${category.id}`} className="block text-xs font-medium text-slate-400 mb-1">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    id={`edit-slug-${category.id}`}
                                    name="slug"
                                    defaultValue={category.slug}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
