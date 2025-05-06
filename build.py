import os

def create_directory_structure():
    # Define the directory structure
    directories = [
        "src",
        "src/components",
        "src/components/Layout",
        "src/components/PromptGroup",
        "src/components/Prompt",
        "src/components/DslFile",
        "src/components/Category",
        "src/components/common",
        "src/contexts",
        "src/hooks",
        "src/utils",
        "src/types",
        "src/styles",
        "src/pages",
        "public"
    ]
    
    # Create directories
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def create_empty_files():
    # Define files to create
    files = [
        # Root files
        "package.json",
        "README.md",
        "tsconfig.json",
        "tailwind.config.js",
        
        # Public files
        "public/index.html",
        "public/manifest.json",
        "public/robots.txt",
        
        # Source files
        "src/App.tsx",
        "src/index.tsx",
        "src/index.css",
        "src/react-app-env.d.ts",
        "src/reportWebVitals.ts",
        "src/setupTests.ts",
        
        # Styles
        "src/styles/global.css",
        "src/styles/iosStyles.css",
        
        # Types
        "src/types/index.ts",
        
        # Contexts
        "src/contexts/AppContext.tsx",
        "src/contexts/ThemeContext.tsx",
        
        # Hooks
        "src/hooks/useLocalStorage.ts",
        "src/hooks/usePromptGroups.ts",
        
        # Utils
        "src/utils/exportUtils.ts",
        "src/utils/fileUtils.ts",
        "src/utils/helpers.ts",
        
        # Components - Layout
        "src/components/Layout/Header.tsx",
        "src/components/Layout/Navigation.tsx",
        "src/components/Layout/Layout.tsx",
        
        # Components - PromptGroup
        "src/components/PromptGroup/PromptGroupCard.tsx",
        "src/components/PromptGroup/PromptGroupList.tsx",
        "src/components/PromptGroup/PromptGroupForm.tsx",
        "src/components/PromptGroup/PromptGroupDetail.tsx",
        
        # Components - Prompt
        "src/components/Prompt/PromptCard.tsx",
        "src/components/Prompt/PromptList.tsx",
        "src/components/Prompt/PromptForm.tsx",
        "src/components/Prompt/PromptDetail.tsx",
        
        # Components - DslFile
        "src/components/DslFile/DslFileUploader.tsx",
        "src/components/DslFile/DslFileList.tsx",
        
        # Components - Category
        "src/components/Category/CategoryBadge.tsx",
        "src/components/Category/CategorySelector.tsx",
        "src/components/Category/CategoryForm.tsx",
        
        # Components - Common
        "src/components/common/Button.tsx",
        "src/components/common/Card.tsx",
        "src/components/common/Input.tsx",
        "src/components/common/TextArea.tsx",
        "src/components/common/Modal.tsx",
        "src/components/common/Dropdown.tsx",
        
        # Pages
        "src/pages/HomePage.tsx",
        "src/pages/PromptGroupDetailPage.tsx",
        "src/pages/CreatePromptGroupPage.tsx",
        "src/pages/EditPromptGroupPage.tsx",
        "src/pages/CreatePromptPage.tsx",
        "src/pages/EditPromptPage.tsx",
        "src/pages/CategoriesPage.tsx",
        "src/pages/SettingsPage.tsx"
    ]
    
    # Create empty files
    for file_path in files:
        with open(file_path, 'w') as f:
            # Leave the file empty
            pass
        print(f"Created empty file: {file_path}")

def main():
    print("Starting creation of directory structure and empty files...")
    create_directory_structure()
    create_empty_files()
    print("Done! All directories and empty files have been created.")

if __name__ == "__main__":
    main()